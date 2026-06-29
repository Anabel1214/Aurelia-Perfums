import zipfile
import re
from pathlib import Path

path = Path('Content.docx')
with zipfile.ZipFile(path) as z:
    data = z.read('word/document.xml').decode('utf-8', errors='ignore')

text = re.sub(r'<[^>]+>', ' ', data)
text = re.sub(r'\s+', ' ', text).strip()
print(text)
