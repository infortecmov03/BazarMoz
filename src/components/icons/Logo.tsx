import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 100 100" {...props}>
        <rect width="100" height="100" rx="15" fill="hsl(var(--primary))" />
        <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fontFamily="Poppins, sans-serif"
            fontSize="50"
            fontWeight="bold"
            fill="hsl(var(--primary-foreground))"
        >
            BM
        </text>
    </svg>
  );
}
