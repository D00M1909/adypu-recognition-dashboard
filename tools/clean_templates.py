"""Copy the NAAC metric workbooks into templates/ with the source university's
name replaced by placeholders. Edits the XML inside each .xlsx so formatting,
validations and charts are kept exactly.

    python tools/clean_templates.py <folder with the source .xlsx files>
"""
import re, sys, zipfile
from pathlib import Path

REPLACE = [
    ("Prepared by: IQAC, Vishwakarma University, Pune", "Prepared by: IQAC, [University Name]"),
    ("does NOT represent Vishwakarma University&apos;s accounts", "do NOT represent any institution&apos;s accounts"),
    ("do NOT represent Vishwakarma University&apos;s accounts", "do NOT represent any institution&apos;s accounts"),
    ("does NOT represent Vishwakarma University", "does NOT represent any institution"),
    ("VISHWAKARMA UNIVERSITY, PUNE", "[UNIVERSITY NAME]"),
    ("Vishwakarma University, Pune", "[University Name]"),
    ("Vishwakarma University", "[University Name]"),
    ("Place: Pune", "Place: [City]"),
]
LEFTOVER = re.compile(r"vishwakarma|\bpune\b|\bVU\b", re.I)

def clean(src: Path, out_dir: Path) -> Path:
    dst = out_dir / src.name.replace("_VU.xlsx", ".xlsx")
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.endswith(".xml"):
                text = data.decode("utf-8")
                for a, b in REPLACE:
                    text = text.replace(a, b)
                left = LEFTOVER.findall(text)
                if left:
                    raise SystemExit(f"{src.name} {item.filename}: still mentions {set(left)}")
                data = text.encode("utf-8")
            zout.writestr(item, data)
    return dst

if __name__ == "__main__":
    out = Path(__file__).resolve().parent.parent / "templates"
    for f in sorted(Path(sys.argv[1]).glob("NAAC_Metric_*.xlsx")):
        print(clean(f, out).name)
