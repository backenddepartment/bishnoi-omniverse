import React from 'react';

/**
 * P8 diagram for Quality & Compliance: the traceability chain every order carries, from the order
 * itself through to its documents. Orange nodes, grey links, labels set in the SVG so it scales
 * with its column (viewBox) and stays readable at phone width.
 */
const NODES = ['Order', 'Supplier', 'Product details', 'Batch or lot', 'Documents'];

const TOP = 52;
const GAP = 88;
const CX = 56;
const R = 20;

export function TraceChain() {
  const height = TOP * 2 + GAP * (NODES.length - 1);
  return (
    <svg
      viewBox={`0 0 400 ${height}`}
      role="img"
      aria-labelledby="trace-chain-title trace-chain-desc"
      style={{ maxWidth: 440, margin: '0 auto' }}
    >
      <title id="trace-chain-title">Order traceability chain</title>
      <desc id="trace-chain-desc">
        A chain of five linked steps: Order, linked to Supplier, linked to Product details, linked
        to Batch or lot, linked to Documents.
      </desc>

      <rect x="1" y="1" width="398" height={height - 2} rx="18" fill="#fff" stroke="#e4ddd0" />

      {NODES.slice(0, -1).map((_, i) => {
        const y1 = TOP + i * GAP + R;
        const y2 = TOP + (i + 1) * GAP - R;
        const mid = (y1 + y2) / 2;
        return (
          <g key={`link-${i}`}>
            <line x1={CX} y1={y1} x2={CX} y2={y2} stroke="#c9c2b4" strokeWidth="2" />
            {/* A small chain link on each connector. */}
            <rect x={CX - 5} y={mid - 13} width="10" height="15" rx="5" fill="#fff" stroke="#9a9384" strokeWidth="2" />
            <rect x={CX - 5} y={mid - 2} width="10" height="15" rx="5" fill="none" stroke="#9a9384" strokeWidth="2" />
          </g>
        );
      })}

      {NODES.map((label, i) => {
        const y = TOP + i * GAP;
        return (
          <g key={label}>
            <circle cx={CX} cy={y} r={R} fill="#f36b21" />
            <circle cx={CX} cy={y} r={R + 6} fill="none" stroke="#f36b21" strokeOpacity="0.25" strokeWidth="2" />
            <text
              x={CX}
              y={y + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#fff"
              fontFamily="var(--font-poppins), sans-serif"
            >
              {i + 1}
            </text>
            <text
              x={CX + 44}
              y={y + 7}
              fontSize="20"
              fontWeight="600"
              fill="#0f0e0c"
              fontFamily="var(--font-poppins), sans-serif"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
