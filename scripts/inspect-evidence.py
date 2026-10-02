from pathlib import Path
import pymupdf as fitz

names = ['p0-landing-flow', 'p1-analysis-flow', 'gepa-screenshot', 'feature-importance-integration-p1-delta-after-rewrite', 'exploitation-proof-1', 'exploitation-proof-1-language-guardrail']
destination = Path('build/evidence-review')
destination.mkdir(parents=True, exist_ok=True)
for name in names:
    document = fitz.open(Path.home() / 'Downloads' / (name + '.pdf'))
    print(name, len(document), 'pages')
    for index, page in enumerate(document):
        text = page.get_text()
        (destination / (name + '-' + str(index + 1) + '.txt')).write_text(text)
        if index < 4:
            page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5)).save(destination / (name + '-' + str(index + 1) + '.png'))
        print(str(index + 1) + ': ' + ' '.join(text.split())[:100])
