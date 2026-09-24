import React, { useState } from 'react';

interface DataPoint {
  label: string; // e.g. '09/18' or 'Mon'
  value: number;
  secondaryValue?: number;
}

interface AreaTrendChartProps {
  data: DataPoint[];
  title?: string;
  unit?: string;
  color?: string; // hex
  secondaryColor?: string;
  height?: number;
  showAverage?: boolean;
}

export const AreaTrendChart: React.FC<AreaTrendChartProps> = ({
  data,
  title,
  unit = '',
  color = '#6366f1',
  secondaryColor = '#10b981',
  height = 180,
  showAverage = true,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-neutral-500">
        No data available to display trend
      </div>
    );
  }

  const values = data.map(d => d.value);
  const maxVal = Math.max(...values, ...(data.map(d => d.secondaryValue || 0)), 10);
  const minVal = Math.min(0, Math.min(...values));
  const range = maxVal - minVal || 1;

  const width = 600;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * chartW;
    const y = paddingY + chartH - ((d.value - minVal) / range) * chartH;
    return { x, y, d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Secondary line if present
  let secPathD = '';
  if (data.some(d => d.secondaryValue !== undefined)) {
    const secPoints = data.map((d, i) => {
      const x = paddingX + (i / Math.max(1, data.length - 1)) * chartW;
      const y = paddingY + chartH - (((d.secondaryValue || 0) - minVal) / range) * chartH;
      return { x, y };
    });
    secPathD = secPoints.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
  }

  const avgValue = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <div className="relative w-full overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</span>
          {showAverage && (
            <span className="text-xs text-neutral-400 font-mono tabular-nums">
              Avg: <strong className="text-neutral-200">{avgValue}{unit}</strong>
            </span>
          )}
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = paddingY + chartH * (1 - ratio);
          const valLabel = Math.round(minVal + range * ratio);
          return (
            <g key={i}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#262626"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                fill="#737373"
                fontSize="10"
                textAnchor="end"
                className="font-mono tabular-nums"
              >
                {valLabel}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />

        {/* Primary Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Secondary Line */}
        {secPathD && (
          <path
            d={secPathD}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="1.75"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />
        )}

        {/* Interactive data points */}
        {points.map((p, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 5.5 : 3}
                fill={isHovered ? '#ffffff' : color}
                stroke="#171717"
                strokeWidth="2"
                className="transition-all duration-150"
              />
              {/* X label */}
              {i % Math.ceil(data.length / 7) === 0 && (
                <text
                  x={p.x}
                  y={height - 6}
                  fill="#737373"
                  fontSize="10"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {p.d.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <g transform={`translate(${points[hoveredIdx].x}, ${points[hoveredIdx].y - 30})`}>
            <rect
              x="-45"
              y="-14"
              width="90"
              height="26"
              rx="4"
              fill="#0a0a0a"
              stroke="#404040"
              strokeWidth="1"
            />
            <text
              x="0"
              y="3"
              fill="#ffffff"
              fontSize="11"
              fontWeight="600"
              textAnchor="middle"
              className="font-mono tabular-nums"
            >
              {points[hoveredIdx].d.value}{unit}
              {points[hoveredIdx].d.secondaryValue !== undefined && ` / ${points[hoveredIdx].d.secondaryValue}${unit}`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
