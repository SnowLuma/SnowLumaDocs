const ALERT_RE =
  /^\[!(NOTE|TIP|INFO|IMPORTANT|WARNING|CAUTION|DANGER)\][ \t]*(.*)$/i;

const TYPE_MAP: Record<string, 'info' | 'warning' | 'error' | 'idea'> = {
  note: 'info',
  tip: 'idea',
  info: 'info',
  important: 'error',
  warning: 'warning',
  caution: 'warning',
  danger: 'error',
};

const TITLE_MAP: Record<string, string> = {
  note: 'Note',
  tip: 'Tip',
  info: 'Info',
  important: 'Important',
  warning: 'Warning',
  caution: 'Caution',
  danger: 'Danger',
};

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  name?: string;
  attributes?: unknown[];
};

function flatten(node: MdNode | undefined): string {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) return node.children.map(flatten).join('');
  return '';
}

function attr(name: string, value: string) {
  return { type: 'mdxJsxAttribute', name, value };
}

function stripMarker(paragraph: MdNode): { kind: string; title: string; rest: MdNode | null } | null {
  const children = paragraph.children ? [...paragraph.children] : [];
  if (children.length === 0) return null;

  const first = children[0];
  if (first?.type === 'text' && typeof first.value === 'string') {
    const nl = first.value.indexOf('\n');
    const firstLine = (nl === -1 ? first.value : first.value.slice(0, nl)).trimEnd();
    const match = ALERT_RE.exec(firstLine.trim());
    if (!match) return null;

    const kind = match[1].toLowerCase();
    const title = match[2].trim();

    if (nl !== -1) {
      first.value = first.value.slice(nl + 1).replace(/^\n/, '');
      if (first.value === '') children.shift();
      paragraph.children = children;
      return { kind, title, rest: children.length > 0 ? paragraph : null };
    }

    children.shift();
    if (children[0]?.type === 'break') children.shift();
    if (children[0]?.type === 'text' && typeof children[0].value === 'string') {
      children[0].value = children[0].value.replace(/^\n+/, '');
      if (children[0].value === '') children.shift();
    }
    if (children.length === 0) return { kind, title, rest: null };
    paragraph.children = children;
    return { kind, title, rest: paragraph };
  }

  const full = flatten(paragraph).trim();
  const match = ALERT_RE.exec(full);
  if (!match || full.includes('\n')) return null;
  return { kind: match[1].toLowerCase(), title: match[2].trim(), rest: null };
}

function toCallout(blockquote: MdNode): MdNode | null {
  const kids = blockquote.children;
  if (!kids?.length || kids[0]?.type !== 'paragraph') return null;
  const parsed = stripMarker(kids[0]);
  if (!parsed) return null;

  const body = parsed.rest ? [parsed.rest, ...kids.slice(1)] : kids.slice(1);
  const type = TYPE_MAP[parsed.kind] ?? 'info';
  const title = parsed.title || TITLE_MAP[parsed.kind] || parsed.kind;

  return {
    type: 'mdxJsxFlowElement',
    name: 'Callout',
    attributes: [attr('type', type), attr('title', title)],
    children: body,
  };
}

function walk(node: MdNode) {
  const children = node.children;
  if (!children) return;
  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (!child) continue;
    if (child.type === 'blockquote') {
      const next = toCallout(child);
      if (next) {
        children[i] = next;
        continue;
      }
    }
    walk(child);
  }
}

export function remarkGithubAlert() {
  return (tree: MdNode) => {
    walk(tree);
  };
}
