from pathlib import Path
import re
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
source = (ROOT / 'cv.md').read_text(encoding='utf-8')
pdfmetrics.registerFont(TTFont('Cambria', 'C:/Windows/Fonts/cambria.ttc', subfontIndex=0))
pdfmetrics.registerFont(TTFont('Cambria-Bold', 'C:/Windows/Fonts/cambriab.ttf'))
pdfmetrics.registerFontFamily('Cambria', normal='Cambria', bold='Cambria-Bold')
ink, muted, accent = map(HexColor, ['#18181d', '#53535f', '#625689'])
body = ParagraphStyle('body', fontName='Cambria', fontSize=10.5, leading=13, textColor=ink, spaceAfter=3)
justified = ParagraphStyle('justified', parent=body, alignment=TA_JUSTIFY)
bullet = ParagraphStyle('bullet', parent=justified, leftIndent=10, firstLineIndent=0, bulletIndent=0, bulletFontName='Cambria', bulletFontSize=10.5, spaceAfter=3)
section = ParagraphStyle('section', parent=body, fontName='Cambria-Bold', fontSize=11, leading=14, textColor=accent, spaceBefore=7, spaceAfter=4, keepWithNext=True)
company = ParagraphStyle('company', parent=body, fontName='Cambria-Bold', fontSize=12, leading=15, spaceAfter=3, keepWithNext=True)
meta = ParagraphStyle('meta', parent=body, fontSize=10, leading=13, textColor=muted, spaceAfter=7, keepWithNext=True)
subsection = ParagraphStyle('subsection', parent=section, fontSize=10.5, spaceBefore=6, spaceAfter=4)
project = ParagraphStyle('project', parent=company, fontSize=10.5, leading=13, spaceBefore=5, spaceAfter=3)
name = ParagraphStyle('name', parent=body, fontName='Cambria-Bold', fontSize=25, leading=29, spaceAfter=2)
role = ParagraphStyle('role', parent=body, fontSize=13, leading=17, textColor=accent, spaceAfter=3)
contact = ParagraphStyle('contact', parent=meta, fontSize=9.5, leading=12, spaceAfter=3)

def rich(text):
    escaped = escape(text)
    return re.sub(r'\[([^]]+)\]\(([^)]+)\)', lambda m: '<link href="'+m[2]+'" color="#625689">'+m[1]+'</link>', escaped)

story = []
lines = source.splitlines()
i = 0
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    if line.startswith('# '):
        story.append(Paragraph(rich(line[2:]), name))
    elif line == 'Fullstack & Backend Engineer':
        story.append(Paragraph(rich(line), role))
    elif line.startswith('## '):
        story.append(Paragraph(rich(line[3:].upper()), section))
    elif line.startswith('##### '):
        story.append(Paragraph(rich(line[6:]), project))
    elif line.startswith('#### '):
        story.append(Paragraph(rich(line[5:]), subsection))
    elif line.startswith('### '):
        story.append(Paragraph(rich(line[4:]), company))
    elif line.startswith('- '):
        story.append(Paragraph(rich(line[2:]), bullet, bulletText='\u2022'))
    elif i < 10:
        story.append(Paragraph(rich(line), contact))
    elif line == 'Fullstack Developer' or line == 'IT Programmer':
        parts = [line]
        while i + 1 < len(lines) and lines[i + 1].strip():
            i += 1
            parts.append(lines[i].strip())
        story.append(Paragraph(rich(' | '.join(parts)), meta))
    else:
        story.append(Paragraph(rich(line), justified))
    i += 1

def page_footer(c, doc):
    width, height = A4
    c.setStrokeColor(HexColor('#dedce4'))
    c.setLineWidth(.5)
    c.line(42, 34, width - 42, 34)
    c.setFont('Cambria', 8)
    c.setFillColor(muted)
    c.drawString(42, 22, 'Rizky Hermawan | Fullstack & Backend Engineer')
    c.drawRightString(width - 42, 22, str(doc.page))

out = REPO / 'public/cv/Rizky_Hermawan_CV_2026_07_29.pdf'
doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=36, bottomMargin=44, title='Rizky Hermawan - Fullstack & Backend Engineer', author='Rizky Hermawan')
doc.build(story, onFirstPage=page_footer, onLaterPages=page_footer)
reader = PdfReader(out)
print('Pages:', len(reader.pages))
# Confirm every source paragraph survives, ignoring line wraps and link formatting.
actual = re.sub(r'\s+', '', ''.join(p.extract_text() for p in reader.pages))
for line in lines:
    line = re.sub(r'^#{1,5} |^- ', '', line.strip())
    line = re.sub(r'\[([^]]+)\]\([^)]+\)', r'\1', line)
    if not line:
        continue
    expected = re.sub(r'\s+', '', line)
    assert expected.casefold() in actual.casefold(), f'Missing: {line}'
print('All CV source paragraphs present.')
