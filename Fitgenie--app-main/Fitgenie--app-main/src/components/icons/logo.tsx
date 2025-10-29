import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="150"
      height="37.5"
      aria-label="FitGenie Logo"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="28" // Adjusted for potentially longer text
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        FitGenie
      </text>
       {/* Optional: A simple abstract flame/leaf icon */}
      <path 
        d="M15 25 C 15 15, 25 10, 35 15 C 45 20, 35 40, 25 40 C 15 40, 15 35, 15 25 Z"
        fill="hsl(var(--accent))"
        transform="translate(-5, 0)"
      />
       <path 
        d="M185 25 C 185 15, 175 10, 165 15 C 155 20, 165 40, 175 40 C 185 40, 185 35, 185 25 Z"
        fill="hsl(var(--accent))"
        transform="translate(5, 0)"
      />
    </svg>
  );
}
