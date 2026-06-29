function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inline(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}

export function renderMarkdown(src: string): string {
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
