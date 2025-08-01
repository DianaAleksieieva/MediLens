# meds.py
import re
from typing import Iterable, List

# Regex pieces
FORM = r"(?:tab(?:\.|let)?|cap(?:\.|sule)?|susp(?:\.|ension)?|syr(?:\.|up)?|inj(?:\.|ection)?|drops?)"
UNITS = r"(?:mg|mcg|g|ml|iu)"
STRENGTH = rf"(?:\d+(?:\.\d+)?\s*{UNITS}\b)"
NAME_TOKEN = r"[A-Za-z][A-Za-z0-9\- ]{0,}"

RX_WITH_FORM = re.compile(rf"\b{FORM}\b[ .:]*({NAME_TOKEN}?)(?:\s*{STRENGTH}|$)", re.I)
RX_FALLBACK  = re.compile(rf"\b({NAME_TOKEN}?)\s+{STRENGTH}\b", re.I)
NOISE = re.compile(r"\b(adv:|gel|paint|ointment|cream|rinse|gargle|massage|mouthwash)\b", re.I)

def _camel_split(s: str) -> str:
    return re.sub(r"(?<=[a-z])(?=[A-Z])", " ", s)

def _tidy_name(s: str) -> str:
    s = _camel_split(s)
    s = re.sub(r"\s{2,}", " ", s).strip(" .,-_|")
    s = " ".join(w if w.isupper() else w.capitalize() for w in s.split())
    return s

def extract_drug_names(lines: Iterable[str]) -> List[str]:
    out, seen = [], set()
    for raw in lines:
        if not isinstance(raw, str):
            continue
        s = raw.strip()
        if not s or NOISE.search(s):
            continue

        m = RX_WITH_FORM.search(s) or RX_FALLBACK.search(s)
        if not m:
            continue

        name = (m.group(1) or "").strip()
        name = re.split(r"\b(\d+-\d+-\d+|x\s*\d+\s*days?|for\s+\d+\s*days?)\b", name, 1, flags=re.I)[0]
        name = re.sub(r"[.,;:|]+$", "", name).strip()
        if len(name) < 2:
            continue

        name = _tidy_name(name)
        k = name.lower()
        if k not in seen:
            seen.add(k)
            out.append(name)
    return out
