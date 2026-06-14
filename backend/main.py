import asyncio
import json
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from config import DEALS_DIR, PORT
from parser import parse_all_deals, parse_deal_file
from watcher import start_watcher

# Single queue receives file-change events from the watchdog thread.
# broadcast_loop fans them out to per-connection subscriber queues.
_change_queue: asyncio.Queue = asyncio.Queue()
_subscribers: list[asyncio.Queue] = []


async def _broadcast_loop():
    while True:
        event = await _change_queue.get()
        for sub in list(_subscribers):
            await sub.put(event)


@asynccontextmanager
async def lifespan(app: FastAPI):
    loop = asyncio.get_event_loop()
    observer = start_watcher(DEALS_DIR, loop, _change_queue)
    task = asyncio.create_task(_broadcast_loop())
    yield
    observer.stop()
    observer.join()
    task.cancel()


app = FastAPI(title="Deal Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/deals")
def get_deals():
    return parse_all_deals(DEALS_DIR)


@app.get("/deals/{deal_id}")
def get_deal(deal_id: str):
    path = DEALS_DIR / f"{deal_id}.md"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Deal not found")
    return parse_deal_file(path)


@app.get("/stream")
async def stream(request: Request):
    """SSE endpoint — emits a `reload` event whenever any .md file changes."""
    queue: asyncio.Queue = asyncio.Queue()
    _subscribers.append(queue)

    async def generator() -> AsyncGenerator[str, None]:
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=30)
                    yield f"data: {json.dumps(event)}\n\n"
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        finally:
            _subscribers.remove(queue)

    return StreamingResponse(generator(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=False)
