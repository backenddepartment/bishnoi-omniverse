import React from 'react';

/**
 * P8 org chart for Group Structure: "Bishnoi Group" at the top, three branches below.
 * Bishnoi Omniverse is picked out in orange; the other two Group businesses are grey.
 */
const BRANCHES = [
  { x: 10, lines: ['Bishnoi', 'Omniverse'], highlight: true },
  { x: 170, lines: ['Getmeds', 'network'], highlight: false },
  { x: 330, lines: ['Naresh Bishnoi', 'Foundation'], highlight: false },
];

export function OrgChart() {
  return (
    <svg
      viewBox="0 0 480 250"
      role="img"
      aria-labelledby="org-chart-title org-chart-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="org-chart-title">Bishnoi Group structure</title>
      <desc id="org-chart-desc">
        The Bishnoi Group at the top, with three branches: Bishnoi Omniverse, the Getmeds network and
        the Naresh Bishnoi Foundation.
      </desc>

      {/* Connectors */}
      <g stroke="#c9c0b0" strokeWidth="1.5" fill="none">
        <path d="M240 76 V122" />
        <path d="M80 122 H400" />
        <path d="M80 122 V160 M240 122 V160 M400 122 V160" />
      </g>

      {/* Parent */}
      <rect x="150" y="16" width="180" height="60" rx="12" fill="#0f0e0c" />
      <text
        x="240"
        y="52"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="17"
        fontWeight="600"
        fontFamily="var(--font-poppins), sans-serif"
      >
        Bishnoi Group
      </text>

      {/* Branches */}
      {BRANCHES.map((b) => (
        <g key={b.lines.join(' ')}>
          <rect
            x={b.x}
            y="160"
            width="140"
            height="72"
            rx="12"
            fill={b.highlight ? '#f36b21' : '#f2ede2'}
            stroke={b.highlight ? '#f36b21' : '#e4ddd0'}
          />
          <text
            x={b.x + 70}
            y="191"
            textAnchor="middle"
            fill={b.highlight ? '#ffffff' : '#1c1a17'}
            fontSize="14"
            fontWeight="600"
            fontFamily="var(--font-poppins), sans-serif"
          >
            <tspan x={b.x + 70} dy="0">
              {b.lines[0]}
            </tspan>
            <tspan x={b.x + 70} dy="18">
              {b.lines[1]}
            </tspan>
          </text>
        </g>
      ))}
    </svg>
  );
}
