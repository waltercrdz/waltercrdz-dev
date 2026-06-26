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
  private checked = new Set<string>();
  private phase: Phase = 'idle';
  private cursorEl: HTMLElement | null = null;
  private abort = false;

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
    root.innerHTML = `
      <style>${STYLES}</style>
      <div class="hero">
        <section class="selector" aria-label="Topic selector">
          <div class="selector__prompt"><span class="prompt">&gt;</span> introduce walter <span class="muted">—select a topic</span></div>
          <ul class="selector__list" role="list">
            ${this.topics
              .map(
                (t) => `
              <li>
                <button class="opt" data-id="${t.id}" type="button" aria-pressed="false">
                  <span class="opt__box" aria-hidden="true">□</span>
                  <span class="opt__label">${t.label}</span>
                </button>
              </li>`
              )
              .join('')}
          </ul>
          <p class="selector__hint muted">click to run · pick more to append</p>
        </section>

        <section class="terminal" aria-label="Agent terminal" aria-live="polite">
          <div class="terminal__bar">
            <span class="dot dot--red"></span>
            <span class="dot dot--yellow"></span>
            <span class="dot dot--green"></span>
            <span class="terminal__title">waltercrdz ~ opencode</span>
          </div>
          <div class="terminal__body" id="transcript"></div>
        </section>
      </div>
    `;

    root.querySelectorAll<HTMLButtonElement>('.opt').forEach((btn) => {
      btn.addEventListener('click', () => this.onToggle(btn));
    });
  }

  private async onToggle(btn: HTMLButtonElement) {
    const id = btn.dataset.id!;
    if (this.checked.has(id)) {
      this.checked.delete(id);
      btn.setAttribute('aria-pressed', 'false');
      btn.querySelector('.opt__box')!.textContent = '□';
      return;
    }
    this.checked.add(id);
    btn.setAttribute('aria-pressed', 'true');
    btn.querySelector('.opt__box')!.textContent = '☒';

    const topic = this.topics.find((t) => t.id === id);
    if (!topic) return;

    if (this.phase !== 'idle') {
      this.abort = true;
      await this.waitForIdle();
    }
    await this.runTurn(topic);
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

    const thinking = document.createElement('div');
    thinking.className = 'thinking';
    turn.appendChild(thinking);

    this.phase = 'thinking';
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

    const body = document.createElement('div');
    body.className = 'body';
    turn.appendChild(body);
    this.cursorEl = this.makeCursor();
    body.appendChild(this.cursorEl);

    this.phase = 'streaming';
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
      const ratio = i / total;
      this.updateTodo(todoItems, ratio);
      await this.delay(8 + Math.random() * 18);
    }
    this.updateTodo(todoItems, 1);
    this.renderMarkdown(body, acc, false);
    if (this.cursorEl) this.cursorEl.remove();
    this.cursorEl = null;
    this.phase = 'idle';
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
}

const STYLES = `
  :host { display: block; }
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    gap: 1rem;
    align-items: stretch;
  }
  @media (max-width: 760px) {
    .hero { grid-template-columns: 1fr; }
  }

  .selector {
    background: var(--oc-bg-panel);
    border: 1px solid var(--oc-border-subtle);
    border-radius: 10px;
    padding: 1.25rem;
    font-family: var(--font-mono);
  }
  .selector__prompt {
    font-size: 0.85rem;
    color: var(--oc-text);
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  .selector__prompt .prompt { color: var(--oc-primary); }
  .selector__list {
    list-style: none;
    margin: 0 0 0.75rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .opt {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    background: transparent;
    border: 1px solid var(--oc-border-subtle);
    border-radius: 6px;
    padding: 0.5rem 0.65rem;
    color: var(--oc-text-muted);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    cursor: pointer;
    text-align: left;
    transition: border-color .15s ease, color .15s ease, background .15s ease;
  }
  .opt:hover {
    border-color: var(--oc-border-active);
    color: var(--oc-text);
  }
  .opt[aria-pressed="true"] {
    color: var(--oc-text);
    border-color: var(--oc-accent);
    background: color-mix(in srgb, var(--oc-accent) 12%, transparent);
  }
  .opt__box { width: 1.1em; color: var(--oc-primary); }
  .opt[aria-pressed="true"] .opt__box { color: var(--oc-accent); }
  .selector__hint { font-size: 0.75rem; margin: 0; }

  .terminal {
    background: var(--oc-bg-panel);
    border: 1px solid var(--oc-border);
    border-radius: 10px;
    overflow: hidden;
    min-height: 340px;
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
    flex: 1;
    max-height: 460px;
  }
  .terminal__body:empty::before {
    content: '› awaiting input — pick a topic';
    color: var(--oc-text-muted);
  }

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
`;

customElements.define('agent-terminal', AgentTerminal);

export default AgentTerminal;
