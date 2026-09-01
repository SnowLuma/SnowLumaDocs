'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_PREFIX = 'sl-docs-feedback:';
const ISSUES_NEW = 'https://github.com/SnowLuma/SnowLumaDocs/issues/new';

type Vote = 'yes' | 'no';

function ThumbUpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden>
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function issueUrl(title: string, pathname: string, lang: string) {
  const zh = lang === 'zh';
  const url = new URL(ISSUES_NEW);
  url.searchParams.set('title', zh ? `文档反馈：${title}` : `Docs feedback: ${title}`);
  url.searchParams.set(
    'body',
    [
      zh ? `页面：\`${pathname}\`` : `Page: \`${pathname}\``,
      '',
      zh ? '问题或建议：' : 'What should change:',
      '',
      '',
    ].join('\n'),
  );
  return url.toString();
}

export function PageFeedback({ lang, title }: { lang: string; title: string }) {
  const pathname = usePathname();
  const [vote, setVote] = useState<Vote | null>(null);
  const zh = lang === 'zh';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + pathname);
      if (stored === 'yes' || stored === 'no') setVote(stored);
      else setVote(null);
    } catch {
      setVote(null);
    }
  }, [pathname]);

  function onVote(next: Vote) {
    try {
      localStorage.setItem(STORAGE_PREFIX + pathname, next);
    } catch {
      // ignore quota / private mode
    }
    setVote(next);
  }

  const href = issueUrl(title, pathname, lang);

  return (
    <div className="mt-10 border-t pt-6">
      <p className="mb-3 text-sm font-medium">{zh ? '这篇文档有帮助吗？' : 'Was this page helpful?'}</p>
      {vote ? (
        <p className="text-sm text-fd-muted-foreground">
          {zh ? '谢谢反馈。' : 'Thanks for the feedback.'}
          {vote === 'no' ? (
            <>
              {' '}
              <a href={href} target="_blank" rel="noreferrer" className="text-fd-primary underline-offset-4 hover:underline">
                {zh ? '在 GitHub 上告诉我们哪里不对' : 'Tell us what to fix on GitHub'}
              </a>
            </>
          ) : null}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={zh ? '文档是否有帮助' : 'Was this page helpful'}>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm hover:bg-fd-accent"
            onClick={() => onVote('yes')}
          >
            <ThumbUpIcon />
            {zh ? '有帮助' : 'Yes'}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm hover:bg-fd-accent"
            onClick={() => onVote('no')}
          >
            <ThumbDownIcon />
            {zh ? '没帮助' : 'No'}
          </button>
        </div>
      )}
    </div>
  );
}
