import re
from typing import Tuple
from langdetect import detect

def normalize_text(text: str) -> str:
    # Strip dangerous controls, collapse excessive spaces, preserve structure
    cleaned = re.sub(r'[\r\t]+', ' ', text)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    cleaned = re.sub(r' +', ' ', cleaned)
    return cleaned.strip()

def detect_language(text: str) -> str:
    try:
        if len(text.strip()) < 10:
            return "en"
        return detect(text)
    except Exception:
        return "en"
