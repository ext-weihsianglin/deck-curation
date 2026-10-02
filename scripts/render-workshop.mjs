import { mkdir, readFile, writeFile } from "node:fs/promises";

const data = JSON.parse(await readFile("storyline.json", "utf8"));
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const embedded = JSON.stringify(data).replaceAll("<", "\\u003c");
const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Storyline workshop · ${escapeHtml(data.title)}</title>
  <style>
    :root { --paper:#f6f3ec; --ink:#111827; --navy:#13263a; --blue:#2f6bff; --cyan:#6dd5ed; --green:#2e8b73; --amber:#d99a2b; --red:#c4473a; --muted:#697386; --line:#d8d5ce; --white:#fff; --font:Aptos,Inter,"Avenir Next",Arial,sans-serif; }
    * { box-sizing:border-box; }
    html { scroll-behavior:smooth; }
    body { margin:0; background:#e8e6e0; color:var(--ink); font-family:var(--font); }
    button,input,textarea,select { font:inherit; }
    button { cursor:pointer; }
    .prototype-banner { padding:8px 20px; background:var(--amber); color:#291d06; font-size:12px; font-weight:800; letter-spacing:.08em; text-align:center; text-transform:uppercase; }
    .app { display:grid; grid-template-columns:310px minmax(0,1fr); min-height:calc(100vh - 32px); }
    .sidebar { position:sticky; top:0; height:calc(100vh - 32px); overflow:auto; padding:24px 18px; background:var(--navy); color:white; }
    .sidebar h1 { margin:0; font-size:22px; line-height:1.1; }
    .sidebar .intro { margin:10px 0 20px; color:rgba(255,255,255,.68); font-size:13px; line-height:1.4; }
    .progress { margin-bottom:18px; }
    .progress-line { height:5px; overflow:hidden; background:rgba(255,255,255,.12); }
    .progress-line span { display:block; height:100%; background:var(--cyan); transition:width .2s ease; }
    .progress-copy { display:flex; justify-content:space-between; margin-top:7px; color:rgba(255,255,255,.72); font-size:12px; }
    .page-list { display:grid; gap:4px; }
    .page-link { display:grid; grid-template-columns:28px 1fr 10px; gap:8px; align-items:center; width:100%; padding:9px 10px; border:0; background:transparent; color:rgba(255,255,255,.76); text-align:left; }
    .page-link:hover,.page-link.active { background:rgba(255,255,255,.09); color:white; }
    .page-link .number { color:var(--cyan); font-size:12px; font-weight:800; }
    .page-link .label { overflow:hidden; font-size:13px; text-overflow:ellipsis; white-space:nowrap; }
    .page-link .dot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,.18); }
    .page-link[data-status="reviewed"] .dot { background:var(--cyan); }
    .page-link[data-status="approved"] .dot { background:#58c89b; }
    .workspace { padding:32px clamp(24px,5vw,76px) 70px; }
    .toolbar { position:sticky; z-index:20; top:0; display:flex; flex-wrap:wrap; gap:10px; align-items:center; justify-content:space-between; margin:-32px calc(clamp(24px,5vw,76px) * -1) 30px; padding:14px clamp(24px,5vw,76px); border-bottom:1px solid var(--line); background:rgba(246,243,236,.94); backdrop-filter:blur(16px); }
    .toolbar-group { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
    .button { min-height:38px; padding:0 13px; border:1px solid var(--line); border-radius:6px; background:white; color:var(--ink); font-weight:700; }
    .button.primary { border-color:var(--blue); background:var(--blue); color:white; }
    .button.danger { color:var(--red); }
    .page-count { color:var(--muted); font-size:13px; font-weight:700; }
    .editor { max-width:1120px; margin:auto; }
    .page-heading { display:grid; grid-template-columns:auto minmax(0,1fr) 170px; gap:20px; align-items:start; margin-bottom:26px; }
    .page-number { display:grid; place-items:center; width:58px; height:58px; background:var(--navy); color:white; font-size:20px; font-weight:850; }
    .page-heading h2 { margin:0; font-size:clamp(32px,4vw,56px); line-height:1; letter-spacing:-.04em; }
    .page-role { margin:12px 0 0; color:var(--muted); font-size:17px; line-height:1.4; }
    .status-select { width:100%; min-height:42px; padding:0 10px; border:1px solid var(--line); background:white; }
    .sheet { display:grid; gap:24px; }
    .section { padding:24px 26px; border-top:4px solid var(--blue); background:var(--paper); box-shadow:0 12px 38px rgba(17,24,39,.07); }
    .section.questions { border-color:var(--green); }
    .section.comments { border-color:var(--amber); }
    .section h3 { margin:0 0 16px; font-size:14px; letter-spacing:.12em; text-transform:uppercase; }
    .field { display:grid; gap:7px; margin-top:16px; }
    .field:first-of-type { margin-top:0; }
    label { color:var(--muted); font-size:12px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; }
    textarea,input[type="text"] { width:100%; border:1px solid var(--line); border-radius:4px; background:white; color:var(--ink); line-height:1.45; }
    textarea { min-height:92px; padding:12px 13px; resize:vertical; }
    input[type="text"] { min-height:44px; padding:0 12px; }
    .core textarea { min-height:112px; font-size:23px; font-weight:650; letter-spacing:-.01em; }
    .talking textarea { min-height:190px; }
    .question { display:grid; grid-template-columns:26px minmax(0,1fr); gap:12px; padding:18px 0; border-top:1px solid var(--line); }
    .question:first-of-type { border-top:0; padding-top:0; }
    .question-number { display:grid; place-items:center; width:26px; height:26px; border-radius:50%; background:var(--green); color:white; font-size:12px; font-weight:800; }
    .question p { margin:2px 0 10px; font-weight:750; line-height:1.35; }
    .question textarea { min-height:82px; }
    .comments textarea { min-height:150px; background:#fffdf6; }
    .save-state { color:var(--muted); font-size:12px; }
    .keyboard { margin-top:22px; color:var(--muted); font-size:12px; text-align:center; }
    .hidden-input { display:none; }
    @media (max-width:850px) {
      .app { display:block; }
      .sidebar { position:relative; height:auto; }
      .page-list { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .page-heading { grid-template-columns:auto 1fr; }
      .status-select { grid-column:1 / -1; }
    }
    @media print { .prototype-banner,.sidebar,.toolbar,.keyboard { display:none; } .app { display:block; } .workspace { padding:0; } .section { box-shadow:none; break-inside:avoid; } }
  </style>
</head>
<body>
  <div class="prototype-banner">Storyline collaboration prototype · Browser-local notes</div>
  <div class="app">
    <aside class="sidebar">
      <h1>20-page storyline</h1>
      <p class="intro">Review the narrative one page at a time. Your edits autosave locally. Export JSON when you want the responses folded into the deck.</p>
      <div class="progress"><div class="progress-line"><span id="progressBar"></span></div><div class="progress-copy"><span id="progressText"></span><span>20 pages</span></div></div>
      <nav class="page-list" id="pageList" aria-label="Storyline pages"></nav>
    </aside>
    <main class="workspace">
      <div class="toolbar">
        <div class="toolbar-group"><button class="button" id="previous">Previous</button><span class="page-count" id="pageCount"></span><button class="button" id="next">Next</button></div>
        <div class="toolbar-group"><span class="save-state" id="saveState">Saved locally</span><button class="button" id="importButton">Import JSON</button><button class="button primary" id="exportButton">Export responses</button><button class="button danger" id="resetButton">Reset page</button></div>
      </div>
      <article class="editor" id="editor"></article>
      <p class="keyboard">Use Alt + ← or Alt + → to move between pages without affecting text fields.</p>
    </main>
  </div>
  <input class="hidden-input" id="importInput" type="file" accept="application/json">
  <script>
    const seed = ${embedded};
    const storageKey = 'deck-storyline-workshop-v' + seed.version;
    const statuses = ['draft', 'reviewed', 'approved'];
    const clone = (value) => JSON.parse(JSON.stringify(value));
    const loadState = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey));
        if (saved && saved.pages?.length === seed.pages.length) return saved;
      } catch {}
      return { ...clone(seed), updated_at: null, pages: seed.pages.map((page) => ({ ...clone(page), status: 'draft', presenter_notes: page.presenter_notes ?? '', comments: '', answers: page.questions.map(() => '') })) };
    };
    let state = loadState();
    let current = Math.max(0, seed.pages.findIndex((page) => '#' + page.id === location.hash));
    const byId = (id) => document.getElementById(id);
    const escapeHtml = (value = '') => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
    const save = () => {
      state.updated_at = new Date().toISOString();
      localStorage.setItem(storageKey, JSON.stringify(state));
      byId('saveState').textContent = 'Saved ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      renderNavigation();
    };
    const page = () => state.pages[current];
    const completion = (item) => item.status !== 'draft' || item.comments.trim() || item.answers.some((answer) => answer.trim());
    const renderNavigation = () => {
      byId('pageList').innerHTML = state.pages.map((item, index) =>
        '<button class="page-link ' + (index === current ? 'active' : '') + '" data-index="' + index + '" data-status="' + escapeHtml(item.status) + '">' +
          '<span class="number">' + escapeHtml(item.id) + '</span>' +
          '<span class="label">' + escapeHtml(item.title) + '</span>' +
          '<span class="dot"></span>' +
        '</button>'
      ).join('');
      const completed = state.pages.filter(completion).length;
      byId('progressBar').style.width = (completed / state.pages.length * 100) + '%';
      byId('progressText').textContent = completed + ' touched';
      byId('pageCount').textContent = 'Page ' + (current + 1) + ' of ' + state.pages.length;
    };
    const field = (label, name, value, className = '') =>
      '<div class="field ' + className + '">' +
        '<label for="' + name + '">' + label + '</label>' +
        '<textarea id="' + name + '" data-field="' + name + '">' + escapeHtml(value) + '</textarea>' +
      '</div>';
    const renderEditor = () => {
      const item = page();
      const statusOptions = statuses.map((status) =>
        '<option value="' + status + '" ' + (item.status === status ? 'selected' : '') + '>' +
          status[0].toUpperCase() + status.slice(1) +
        '</option>'
      ).join('');
      const questionMarkup = item.questions.map((question, index) =>
        '<div class="question">' +
          '<div class="question-number">' + (index + 1) + '</div>' +
          '<div><p>' + escapeHtml(question) + '</p>' +
          '<textarea data-answer="' + index + '" placeholder="Your answer…">' + escapeHtml(item.answers[index] ?? '') + '</textarea></div>' +
        '</div>'
      ).join('');
      byId('editor').innerHTML =
        '<header class="page-heading">' +
          '<div class="page-number">' + escapeHtml(item.id) + '</div>' +
          '<div><h2>' + escapeHtml(item.title) + '</h2><p class="page-role">' + escapeHtml(item.role) + '</p></div>' +
          '<select class="status-select" id="status">' + statusOptions + '</select>' +
        '</header>' +
        '<div class="sheet">' +
          '<section class="section"><h3>Proposed page</h3>' +
            field('Page title', 'title', item.title) +
            field('Core message', 'core_message', item.core_message, 'core') +
            field('Talking points · one per line', 'talking_points', item.talking_points.join('\\n'), 'talking') +
            field('Visual or evidence', 'visual', item.visual) +
            field('Presenter notes', 'presenter_notes', item.presenter_notes) +
          '</section>' +
          '<section class="section questions"><h3>Questions for you</h3>' + questionMarkup + '</section>' +
          '<section class="section comments"><h3>Comments</h3><div class="field">' +
            '<label for="comments">Anything else to change, challenge, remove, or move</label>' +
            '<textarea id="comments" data-field="comments" placeholder="Leave comments for this page…">' + escapeHtml(item.comments) + '</textarea>' +
          '</div></section>' +
        '</div>';
      byId('status').addEventListener('change', (event) => { item.status = event.target.value; save(); });
      byId('editor').querySelectorAll('[data-field]').forEach((element) => element.addEventListener('input', () => {
        item[element.dataset.field] = element.dataset.field === 'talking_points' ? element.value.split('\\n').filter(Boolean) : element.value;
        save();
      }));
      byId('editor').querySelectorAll('[data-answer]').forEach((element) => element.addEventListener('input', () => { item.answers[Number(element.dataset.answer)] = element.value; save(); }));
      renderNavigation();
      location.hash = item.id;
      scrollTo({top:0, behavior:'smooth'});
    };
    const go = (index) => { current = Math.max(0, Math.min(state.pages.length - 1, index)); renderEditor(); };
    byId('pageList').addEventListener('click', (event) => { const button = event.target.closest('[data-index]'); if (button) go(Number(button.dataset.index)); });
    byId('previous').addEventListener('click', () => go(current - 1));
    byId('next').addEventListener('click', () => go(current + 1));
    byId('resetButton').addEventListener('click', () => {
      const original = seed.pages[current];
      state.pages[current] = { ...clone(original), status:'draft', presenter_notes:original.presenter_notes ?? '', comments:'', answers:original.questions.map(() => '') };
      save(); renderEditor();
    });
    byId('exportButton').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'storyline-workshop-responses.json';
      link.click();
      URL.revokeObjectURL(link.href);
    });
    byId('importButton').addEventListener('click', () => byId('importInput').click());
    byId('importInput').addEventListener('change', async (event) => {
      const imported = JSON.parse(await event.target.files[0].text());
      if (!imported.pages || imported.pages.length !== seed.pages.length) return;
      state = imported; save(); renderEditor();
    });
    addEventListener('keydown', (event) => {
      if (!event.altKey) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(current - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); go(current + 1); }
    });
    renderEditor();
  </script>
</body>
</html>`;

await mkdir("build", { recursive: true });
await writeFile("build/storyline-workshop.html", html);
console.log(`Rendered ${data.pages.length}-page storyline workshop to build/storyline-workshop.html`);
