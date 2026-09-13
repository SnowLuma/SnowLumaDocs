import type { SVGProps } from 'react';

export function SnowMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 4v32M4 20h32M8.7 8.7l22.6 22.6M8.7 31.3 31.3 8.7M14.5 7.5 20 13l5.5-5.5M32.5 14.5 27 20l5.5 5.5M25.5 32.5 20 27l-5.5 5.5M7.5 25.5 13 20l-5.5-5.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
