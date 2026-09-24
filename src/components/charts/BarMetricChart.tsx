import React, { useState } from 'react';

interface BarItem {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

interface BarMetricChartProps {
  data: BarItem[];
  title?: string;
  unit?: string;
  primaryColor?: string;
  secondaryColor?: string;
  height?: number;
  legendPrimary?: string;
  legendSecondary?: string;
}

export const BarMetricChart: React.FC<BarMetricChartProps> = ({
  data,
  title,
  unit = '',
  primaryColor = '#3b82f6',
  secondaryColor = '#10b981',
  height = 180,
  legendPrimary = 'Actual',
  legendSecondary = 'Target / Prior',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return <div className="h-40 flex items-center justify-center text-xs text-neutral-500">No data</div>;
  }

  const allVals = data.flatMap(d => [d.value, d.secondaryValue || 0]);
  const maxVal = Math.max(...allVals, 5);

  const width = 600;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const slotW = chartW / data.length;
  const barW = Math.min(28, slotW * 0.38);

  const hasSecondary = data.some(d => d.secondaryValue !== undefined);

  return (
    <div className="relative w-full">
      {(title || hasSecondary) && (
        <div className="flex items-center justify-between px-1 mb-2">
          {title && <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</span>}
          {hasSecondary && (
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: primaryColor }} />
                {legendPrimary}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs" style={{ backgroundColor: secondaryColor }} />
                {legendSecondary}
              </span>
            </div>
          )}
        </div>
      )}

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
        {/* Horizontal grid */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = paddingY + chartH * (1 - ratio);
          return (
            <g key={i}>
              <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#262626" strokeDasharray="3 3" />
              <text x={paddingX - 8} y={y + 3} fill="#737373" fontSize="10" textAnchor="end" className="font-mono tabular-nums">
                {Math.round(maxVal * ratio)}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, i) => {
          const centerX = paddingX + i * slotW + slotW / 2;
          const h1 = Math.max(2, (item.value / maxVal) * chartH);
          const y1 = paddingY + chartH - h1;

          const isHovered = hoveredIdx === i;

          return (
            <g
              key={i}
              className="cursor-pointer transition-opacity duration-150"
              opacity={hoveredIdx === null || isHovered ? 1 : 0.6}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {hasSecondary ? (
                <>
                  {/* Secondary bar */}
                  {item.secondaryValue !== undefined && (
                    <rect
                      x={centerX - barW - 1.5}
                      y={paddingY + chartH - Math.max(2, (item.secondaryValue / maxVal) * chartH)}
                      width={barW}
                      height={Math.max(2, (item.secondaryValue / maxVal) * chartH)}
                      rx="2"
                      fill={secondaryColor}
                    />
                  )}
                  {/* Primary bar */}
                  <rect
                    x={centerX + 1.5}
                    y={y1}
                    width={barW}
                    height={h1}
                    rx="2"
                    fill={item.color || primaryColor}
                  />
                </>
              ) : (
                <rect
                  x={centerX - barW / 2}
                  y={y1}
                  width={barW}
                  height={h1}
                  rx="3"
                  fill={item.color || primaryColor}
                />
              )}

              {/* X label */}
              <text
                x={centerX}
                y={height - 6}
                fill={isHovered ? '#f5f5f5' : '#737373'}
                fontSize="10"
                textAnchor="middle"
                className="font-mono"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredIdx !== null && (
          <g
            transform={`translate(${
              paddingX + hoveredIdx * slotW + slotW / 2
            }, ${paddingY - 14})`}
          >
            <rect x="-40" y="-12" width="80" height="24" rx="4" fill="#0a0a0a" stroke="#404040" />
            <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="600" textAnchor="middle" className="font-mono tabular-nums">
              {data[hoveredIdx].value}{unit}
              {data[hoveredIdx].secondaryValue !== undefined && ` vs ${data[hoveredIdx].secondaryValue}${unit}`}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
