from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

DEALS_DIR = Path(os.getenv("DEALS_DIR", "../deals")).resolve()
PORT = int(os.getenv("PORT", "8000"))
