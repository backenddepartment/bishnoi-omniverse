import React from 'react';

/**
 * P8 diagram for Governance: the continuous-improvement loop. Four points on a circle joined by
 * orange clockwise arrows: review, find the cause, adjust, repeat. Labels sit just inside the
 * ring so the drawing keeps its full width in the column at every size.
 */

const CX = 240;
const CY = 200;
const R = 130;
const GAP = 15; // degrees left clear either side of each point so the arrows do not touch it

const POINTS = [
  { angle: -90, label: 'Review', dx: 0, dy: 40, anchor: 'middle' as const },
  { angle: 0, label: 'Find the cause', dx: -24, dy: 6, anchor: 'end' as const },
  { angle: 90, label: 'Adjust', dx: 0, dy: -28, anchor: 'middle' as const },
  { angle: 180, label: 'Repeat', dx: 24, dy: 6, anchor: 'start' as const },
];

function at(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: +(CX + R * Math.cos(rad)).toFixed(1), y: +(CY + R * Math.sin(rad)).toFixed(1) };
}

export function ImprovementLoop() {
  return (
    <svg viewBox="0 0 480 400" role="img" aria-labelledby="gov-loop-title gov-loop-desc">
      <title id="gov-loop-title">Continuous improvement loop</title>
      <desc id="gov-loop-desc">
        A circular cycle of four steps: review, find the cause, adjust, then repeat, leading back
        to review.
      </desc>
      <defs>
        <marker
          id="gov-loop-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* Faint full ring behind the arrows */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--accent-tint)" strokeWidth={10} />

      {POINTS.map((p) => {
        const start = at(p.angle + GAP);
        const end = at(p.angle + 90 - GAP);
        return (
          <path
            key={`arc-${p.label}`}
            d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#gov-loop-arrow)"
          />
        );
      })}

      {POINTS.map((p) => {
        const c = at(p.angle);
        return (
          <g key={`pt-${p.label}`}>
            <circle cx={c.x} cy={c.y} r={11} fill="#fff" stroke="var(--accent)" strokeWidth={3} />
            <circle cx={c.x} cy={c.y} r={4.5} fill="var(--accent)" />
            <text
              x={c.x + p.dx}
              y={c.y + p.dy}
              textAnchor={p.anchor}
              fill="var(--ink-soft)"
              fontSize={18}
              fontWeight={500}
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
