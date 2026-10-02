import hashlib
import json
import shutil
from pathlib import Path
import pymupdf as fitz

destination = Path('assets/imported')
destination.mkdir(parents=True, exist_ok=True)
selections = [
    ('landing', 'p0-landing-flow', 1, (44, 295, 568, 720)),
    ('source-input', 'p0-landing-flow', 2, (45, 25, 348, 706)),
    ('parsed-page', 'p1-analysis-flow', 1, (45, 295, 568, 720)),
    ('query-scores', 'p1-analysis-flow', 2, (47, 112, 567, 660)),
    ('rewrite-effects', 'feature-importance-integration-p1-delta-after-rewrite', 2, (62, 307, 548, 649)),
    ('query-regressions', 'feature-importance-integration-p1-delta-after-rewrite', 3, (65, 82, 548, 444)),
    ('model-weights', 'feature-importance-integration-p1-delta-after-rewrite', 4, (65, 333, 550, 649)),
    ('fidelity-findings', 'feature-importance-integration-p1-delta-after-rewrite', 1, (45, 514, 568, 746)),
    ('draft-review', 'feature-importance-integration-p1-delta-after-rewrite', 1, (44, 296, 568, 501)),
    ('exploit-score', 'exploitation-proof-1', 2, (47, 26, 565, 270)),
    ('exploit-translation', 'exploitation-proof-1', 23, (46, 30, 347, 399)),
    ('guarded-score', 'exploitation-proof-1-language-guardrail', 2, (47, 25, 565, 216)),
    ('gepa-config', 'gepa-screenshot', 1, (40, 447, 586, 723)),
    ('gepa-selected', 'gepa-screenshot', 1, (40, 314, 586, 448)),
    ('gepa-frontier', 'gepa-screenshot', 3, (47, 24, 577, 146)),
    ('gepa-progress', 'gepa-screenshot', 2, (40, 69, 584, 235)),
]
registry = []
for name, source, number, rectangle in selections:
    path = Path.home() / 'Downloads' / (source + '.pdf')
    with fitz.open(path) as document:
        document[number - 1].get_pixmap(matrix=fitz.Matrix(3, 3), clip=fitz.Rect(rectangle)).save(destination / (name + '.png'))
    registry.append({'id': name, 'source': str(path), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'page': number, 'crop_points': rectangle, 'output': str(destination / (name + '.png'))})
    shutil.copy2(path, destination / path.name)

reports = {
    'brief-report.html': Path('../content-optimization-system/analysis/brief-report.html'),
    'extraction-evaluation.html': Path('../content-optimization-system/analysis/extraction-evaluation.html'),
    'scorer-v6.html': Path('../content-optimization-system/.worktrees/deck-prototype-trad-ml-scorers/trad_ml_scorer/v6/report.html'),
    'scorer-v71.html': Path('../content-optimization-system/.worktrees/deck-prototype-trad-ml-scorers/trad_ml_scorer/v7.1/report.html'),
    'fixed-prompt.html': Path('../content-optimization-system/.worktrees/deck-prototype-trad-ml-scorers/trad_ml_scorer/interpretation/fixed_prompt/report.html'),
}
for name, source in reports.items():
    shutil.copy2(source, destination / name)
    registry.append({'id': name.removesuffix('.html'), 'source': str(source.resolve()), 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'output': str(destination / name)})
Path('build/evidence-review/selections.json').write_text(json.dumps(registry, indent=2) + '\n')
print('Prepared', len(selections), 'deliberate PDF crops and', len(reports), 'source reports.')
