export interface HeroTopic {
  id: string;
  label: string;
  heading: string;
  todo: string[];
  body: string;
}

type Phase = 'idle' | 'thinking' | 'streaming';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

class AgentTerminal extends HTMLElement {
  private topics: HeroTopic[] = [];
  private queried = new Set<string>();
  private phase: Phase = 'idle';
  private cursorEl: HTMLElement | null = null;
  private abort = false;
  private statusEl: HTMLElement | null = null;
  private topicsCountEl: HTMLElement | null = null;
  private buffer = '';
  private rafScroll = 0;

  connectedCallback() {
    const raw = this.getAttribute('data-topics');
    if (raw) {
      try {
        this.topics = JSON.parse(raw);
      } catch (_) {
        this.topics = [];
      }
    }
    this.render();
  }

  private render() {
    const root = this.attachShadow({ mode: 'open' });
    const lastKey = String.fromCharCode(65 + this.topics.length - 1);
    root.innerHTML = `
      <style>${STYLES}</style>
      <div class="ide">
        <section class="workspace" aria-label="Query agent terminal">
          <div class="terminal">
            <div class="terminal__bar">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
              <span class="terminal__title">waltercrdz ~ opencode</span>
            </div>
            <div class="terminal__body" id="transcript"></div>
            <div class="prompt-turn">
              <div class="prompt-q"><span class="q">?</span> What would you like to know?</div>
              <ul class="opts" role="list">
                ${this.topics
                  .map((t, i) => {
                    const key = String.fromCharCode(65 + i);
                    return `
                  <li>
                    <button class="opt" data-id="${t.id}" data-key="${key}" type="button" aria-label="Run query: ${t.label}">
                      <span class="opt__key">${key})</span>
                      <span class="opt__label">${t.label}</span>
                      <span class="opt__mark" aria-hidden="true"></span>
                    </button>
                  </li>`;
                  })
                  .join('')}
              </ul>
            </div>
            <div class="inputbar">
              <span class="inputbar__prompt">&gt;</span>
              <span class="inputbar__field" id="inputfield" tabindex="0" aria-label="Query input"></span>
              <span class="agent-pill" title="query agent">Query <span class="agent-pill__caret">▾</span></span>
            </div>
            <p class="prompt-hint muted">› type A–${lastKey}, then Enter — or click to run a query</p>
          </div>
        </section>

        <aside class="sidebar" aria-label="Session info">
          <div class="side__group">
            <div class="side__label">session</div>
            <div class="side__value">waltercrdz</div>
          </div>
          <div class="side__group">
            <div class="side__label">status</div>
            <div class="side__value" id="status">idle</div>
          </div>
          <div class="side__group">
            <div class="side__label">agent</div>
            <div class="side__value side__value--accent">query</div>
          </div>
          <div class="side__group">
            <div class="side__label">topics</div>
            <div class="side__value" id="topics-count">0/${this.topics.length}</div>
          </div>
        </aside>
      </div>
    `;

    this.statusEl = root.getElementById('status');
    this.topicsCountEl = root.getElementById('topics-count');

    root.querySelectorAll<HTMLButtonElement>('.opt').forEach((btn) => {
      btn.addEventListener('click', () => this.onPick(btn.dataset.id!));
    });

    const field = root.getElementById('inputfield') as HTMLElement | null;
    field?.addEventListener('keydown', (e) => this.onInputKey(e));
    root.querySelector('.terminal')?.addEventListener('click', () => field?.focus());
    field?.focus();
  }

  private onInputKey(e: KeyboardEvent) {
    e.preventDefault();
    const field = e.currentTarget as HTMLElement;
    const lastKey = String.fromCharCode(65 + this.topics.length - 1);
    if (e.key === 'Enter') {
      const idx = this.buffer.toUpperCase().charCodeAt(0) - 65;
      this.buffer = '';
      if (field) field.textContent = '';
      if (idx >= 0 && idx < this.topics.length) this.onPick(this.topics[idx].id);
      return;
    }
    if (e.key === 'Backspace') {
      this.buffer = '';
      if (field) field.textContent = '';
      return;
    }
    if (e.key.length !== 1) return;
    const up = e.key.toUpperCase();
    if (up < 'A' || up > lastKey) return;
    this.buffer = up;
    if (field) field.textContent = up;
  }

  private async onPick(id: string) {
    const topic = this.topics.find((t) => t.id === id);
    if (!topic) return;
    if (this.phase !== 'idle') {
      this.abort = true;
      await this.waitForIdle();
    }
    this.markQueried(id);
    await this.runTurn(topic);
  }

  private markQueried(id: string) {
    this.queried.add(id);
    const btn = this.shadowRoot!.querySelector<HTMLButtonElement>(`.opt[data-id="${id}"]`);
    if (btn) {
      btn.classList.add('queried');
      const mark = btn.querySelector('.opt__mark');
      if (mark) mark.textContent = '✓';
    }
    if (this.topicsCountEl) this.topicsCountEl.textContent = `${this.queried.size}/${this.topics.length}`;
  }

  private setStatus(label: string, cls: string) {
    if (!this.statusEl) return;
    this.statusEl.textContent = label;
    this.statusEl.className = `side__value ${cls}`;
  }

  private waitForIdle(): Promise<void> {
    return new Promise((resolve) => {
      const check = () => {
        if (this.phase === 'idle') resolve();
        else setTimeout(check, 30);
      };
      check();
    });
  }

  private async runTurn(topic: HeroTopic): Promise<void> {
    const transcript = this.shadowRoot!.getElementById('transcript')!;
    const turn = document.createElement('div');
    turn.className = 'turn';
    transcript.appendChild(turn);

    const userLine = document.createElement('div');
    userLine.className = 'user-line';
    userLine.textContent = `› ${topic.label.toLowerCase()}`;
    turn.appendChild(userLine);
    this.scrollToBottom(transcript);

    const thinking = document.createElement('div');
    thinking.className = 'thinking';
    turn.appendChild(thinking);
    this.scrollToBottom(transcript);

    this.phase = 'thinking';
    this.setStatus('thinking', 'side__value--accent');
    await this.spin(thinking, 700 + Math.random() * 500);
    if (this.abort) {
      this.abort = false;
      this.phase = 'idle';
      thinking.remove();
      return this.runTurn(topic);
    }
    thinking.remove();

    const todo = document.createElement('div');
    todo.className = 'todo';
    turn.appendChild(todo);
    const todoItems = topic.todo.map((label) => {
      const row = document.createElement('div');
      row.className = 'todo__item';
      row.innerHTML = `<span class="todo__box">☐</span> <span class="todo__text">${label}</span>`;
      todo.appendChild(row);
      return row;
    });
    this.scrollToBottom(transcript);

    const body = document.createElement('div');
    body.className = 'body';
    turn.appendChild(body);
    this.cursorEl = this.makeCursor();
    body.appendChild(this.cursorEl);

    this.phase = 'streaming';
    this.setStatus('streaming', 'side__value--success');
    const full = topic.body;
    let acc = '';
    const total = full.length;
    for (let i = 0; i < total; i++) {
      if (this.abort) {
        this.abort = false;
        break;
      }
      acc += full[i];
      this.renderMarkdown(body, acc, true);
      this.scheduleScroll(transcript);
      const ratio = i / total;
      this.updateTodo(todoItems, ratio);
      await this.delay(8 + Math.random() * 18);
    }
    this.updateTodo(todoItems, 1);
    this.renderMarkdown(body, acc, false);
    if (this.cursorEl) this.cursorEl.remove();
    this.cursorEl = null;
    this.phase = 'idle';
    this.setStatus('idle', '');
    this.scrollToBottom(transcript);
  }

  private updateTodo(items: HTMLElement[], ratio: number) {
    const n = items.length;
    items.forEach((row, idx) => {
      const threshold = n === 1 ? 0.99 : idx / (n - 1);
      const box = row.querySelector('.todo__box')!;
      if (ratio >= threshold - 0.02) {
        if (box.textContent !== '☒') {
          box.textContent = '☒';
          row.classList.add('done');
        }
      }
    });
  }

  private async spin(el: HTMLElement, ms: number) {
    let i = 0;
    const start = performance.now();
    return new Promise<void>((resolve) => {
      const tick = () => {
        const elapsed = performance.now() - start;
        if (elapsed >= ms) {
          resolve();
          return;
        }
        el.innerHTML = `<span class="spinner">${SPINNER_FRAMES[i % SPINNER_FRAMES.length]}</span> <span class="muted">Thinking…</span>`;
        i++;
        setTimeout(tick, 70);
      };
      tick();
    });
  }

  private makeCursor(): HTMLElement {
    const c = document.createElement('span');
    c.className = 'cursor';
    c.textContent = '▋';
    return c;
  }

  private renderMarkdown(el: HTMLElement, src: string, streaming: boolean) {
    const html = this.md(src);
    el.innerHTML = html + (streaming ? '<span class="cursor">▋</span>' : '');
  }

  private md(src: string): string {
    const esc = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const inline = (s: string) =>
      esc(s)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        );

    const lines = src.split('\n');
    let out = '';
    let inList = false;
    let para: string[] = [];

    const flushPara = () => {
      if (para.length) {
        out += `<p>${inline(para.join(' '))}</p>`;
        para = [];
      }
    };
    const closeList = () => {
      if (inList) {
        out += '</ul>';
        inList = false;
      }
    };

    for (const raw of lines) {
      const line = raw.trimEnd();
      if (line.startsWith('## ')) {
        flushPara();
        closeList();
        out += `<h2>${inline(line.slice(3))}</h2>`;
      } else if (line.startsWith('- ')) {
        flushPara();
        if (!inList) {
          out += '<ul>';
          inList = true;
        }
        out += `<li>${inline(line.slice(2))}</li>`;
      } else if (line === '') {
        flushPara();
        closeList();
      } else {
        closeList();
        para.push(line);
      }
    }
    flushPara();
    closeList();
    return out;
  }

  private delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }

  private scrollToBottom(el: HTMLElement) {
    el.scrollTop = el.scrollHeight;
  }

  private scheduleScroll(el: HTMLElement) {
    if (this.rafScroll) return;
    this.rafScroll = requestAnimationFrame(() => {
      this.rafScroll = 0;
      el.scrollTop = el.scrollHeight;
    });
  }
}

const STYLES = `
  :host { display: block; }
  .ide {
    display: grid;
    grid-template-columns: minmax(0, 6fr) minmax(0, 1fr);
    gap: 1rem;
    align-items: stretch;
  }
  @media (max-width: 760px) {
    .ide { grid-template-columns: 1fr; }
    .sidebar { display: none; }
    .terminal { min-height: 620px; }
    .terminal__body { height: 55vh; font-size: 0.82rem; }
    .inputbar { font-size: 0.82rem; }
  }

  .workspace { min-width: 0; }
  .terminal {
    background: var(--oc-bg-panel);
    border: 1px solid var(--oc-border);
    border-radius: 10px;
    overflow: hidden;
    min-height: 720px;
    display: flex;
    flex-direction: column;
  }
  .terminal__bar {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.85rem;
    background: var(--oc-bg-element);
    border-bottom: 1px solid var(--oc-border-subtle);
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot--red { background: var(--oc-error); }
  .dot--yellow { background: var(--oc-warning); }
  .dot--green { background: var(--oc-success); }
  .terminal__title {
    margin-left: 0.5rem;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--oc-text-muted);
  }
  .terminal__body {
    padding: 1rem 1.1rem;
    overflow-y: auto;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--oc-text);
    flex: none;
    height: 50vh;
  }

  .prompt-turn {
    padding: 0.85rem 1.1rem;
    border-top: 1px solid var(--oc-border-subtle);
    flex: none;
  }
  .prompt-q { color: var(--oc-text); margin-bottom: 0.65rem; }
  .prompt-q .q { color: var(--oc-secondary); margin-right: 0.35rem; }
  .opts {
    list-style: none;
    margin: 0 0 0.6rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .opt {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: transparent;
    border: 1px solid var(--oc-border-subtle);
    border-radius: 6px;
    padding: 0.45rem 0.65rem;
    color: var(--oc-text);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    cursor: pointer;
    text-align: left;
    transition: border-color .15s ease, color .15s ease, background .15s ease;
  }
  .opt:hover {
    border-color: var(--oc-secondary);
    background: color-mix(in srgb, var(--oc-secondary) 10%, transparent);
  }
  .opt:focus-visible {
    outline: 2px solid var(--oc-secondary);
    outline-offset: 1px;
  }
  .opt__key { color: var(--oc-secondary); width: 1.6em; flex: none; }
  .opt__label { flex: 1; }
  .opt__mark { color: var(--oc-success); }
  .opt.queried { color: var(--oc-text-muted); border-color: var(--oc-border-subtle); }
  .opt.queried .opt__label { text-decoration: line-through; text-decoration-color: var(--oc-border-active); }
  .prompt-hint {
    font-size: 0.75rem;
    margin: 0;
    padding: 0.5rem 0.85rem 0.6rem;
    background: var(--oc-bg-element);
    border-top: 1px solid var(--oc-border-subtle);
    color: var(--oc-text-muted);
  }

  .inputbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.85rem;
    background: var(--oc-bg-element);
    border-top: 1px solid var(--oc-border-subtle);
    font-family: var(--font-mono);
    font-size: 0.85rem;
  }
  .inputbar__prompt { color: var(--oc-primary); }
  .inputbar__field {
    flex: 1;
    color: var(--oc-text-muted);
    border-bottom: 1px solid var(--oc-border-subtle);
    min-height: 1.2em;
    outline: none;
  }
  .inputbar__field:focus {
    border-bottom-color: var(--oc-secondary);
    color: var(--oc-text);
  }
  .inputbar__field:focus::after {
    content: '▋';
    color: var(--oc-secondary);
    animation: blink 1s steps(2) infinite;
  }
  .agent-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    border: 1px solid var(--oc-secondary);
    border-radius: 6px;
    padding: 0.2rem 0.6rem;
    color: var(--oc-secondary);
    font-size: 0.78rem;
    background: color-mix(in srgb, var(--oc-secondary) 12%, transparent);
    user-select: none;
  }
  .agent-pill__caret { font-size: 0.7rem; }

  .sidebar {
    background: var(--oc-bg-panel);
    border: 1px solid var(--oc-border-subtle);
    border-radius: 10px;
    padding: 1.1rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.7;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .side__group { display: flex; flex-direction: column; gap: 0.1rem; }
  .side__label {
    color: var(--oc-text-muted);
    text-transform: lowercase;
    letter-spacing: 0.04em;
  }
  .side__value { color: var(--oc-text); }
  .side__value--accent { color: var(--oc-accent); }
  .side__value--success { color: var(--oc-success); }
  .side__sep {
    height: 1px;
    background: var(--oc-border-subtle);
    margin: 0.15rem 0;
  }

  .user-line { color: var(--oc-secondary); margin-bottom: 0.5rem; }
  .thinking { color: var(--oc-accent); }
  .thinking .spinner { display: inline-block; width: 1ch; }
  .thinking .muted { color: var(--oc-text-muted); }

  .turn { margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px dashed var(--oc-border-subtle); }
  .turn:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  .todo { margin-bottom: 0.85rem; }
  .todo__item { color: var(--oc-text-muted); }
  .todo__item.done { color: var(--oc-text); }
  .todo__item.done .todo__text { text-decoration: line-through; text-decoration-color: var(--oc-border-active); }
  .todo__box { color: var(--oc-primary); margin-right: 0.35rem; }
  .todo__item.done .todo__box { color: var(--oc-success); }

  .body h2 {
    color: var(--oc-accent);
    font-size: 0.95rem;
    margin: 0 0 0.5rem;
  }
  .body p { margin: 0 0 0.5rem; }
  .body ul { margin: 0 0 0.5rem; padding-left: 1.1rem; }
  .body li { margin-bottom: 0.25rem; list-style: '› '; }
  .body strong { color: var(--oc-primary); font-weight: 600; }
  .body a { color: var(--oc-info); }
  .body code { color: var(--oc-success); }

  .cursor {
    display: inline-block;
    color: var(--oc-primary);
    animation: blink 1s steps(2) infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .cursor, .inputbar__field:focus::after { animation: none; }
  }
`;

customElements.define('agent-terminal', AgentTerminal);

export default AgentTerminal;
