'use client';

// Client-only Mermaid renderer. Mermaid pulls in d3 + a large parse
// table and only runs in the browser, so we lazy-load it and bind to
// the current Fumadocs theme so the diagram colors track light/dark.

import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });
        // mermaid.render returns SVG as a string; using a stable id
        // namespaced by useId keeps SSR + client output consistent.
        const renderId = `mermaid-${id.replace(/:/g, '')}`;
        const { svg } = await mermaid.render(renderId, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, resolvedTheme, id]);

  if (error) {
    return (
      <pre className="text-fd-destructive">
        Mermaid render failed: {error}
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto"
      aria-label="Mermaid diagram"
    />
  );
}
