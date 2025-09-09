import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9.5V8" />
      <path d="M16 12h1.5" />
      <path d="M12 14.5V16" />
      <path d="M8 12H6.5" />
      <path d="m14.12 9.88.35-.35" />
      <path d="m9.88 14.12.35-.35" />
      <path d="m14.47 14.12-.35-.35" />
      <path d="m9.53 9.88-.35-.35" />
    </svg>
  );
}
