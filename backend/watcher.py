import asyncio
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileSystemEvent


class _Handler(FileSystemEventHandler):
    def __init__(self, loop: asyncio.AbstractEventLoop, queue: asyncio.Queue):
        self._loop = loop
        self._queue = queue

    def _notify(self, event: FileSystemEvent):
        if str(event.src_path).endswith(".md"):
            self._loop.call_soon_threadsafe(
                self._queue.put_nowait,
                {"type": "reload", "path": str(event.src_path)},
            )

    def on_modified(self, event): self._notify(event)
    def on_created(self, event): self._notify(event)
    def on_deleted(self, event): self._notify(event)


def start_watcher(
    deals_dir: Path,
    loop: asyncio.AbstractEventLoop,
    queue: asyncio.Queue,
) -> Observer:
    handler = _Handler(loop, queue)
    observer = Observer()
    observer.schedule(handler, str(deals_dir), recursive=False)
    observer.start()
    print(f"[watcher] Watching {deals_dir}")
    return observer
