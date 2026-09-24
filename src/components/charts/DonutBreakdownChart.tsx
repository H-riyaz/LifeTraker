import React, { useState } from 'react';

interface Slice {
  label: string;
  value: number;
  color: string;
}

interface DonutBreakdownChartProps {
  data: Slice[];
  title?: string;
  unit?: string;
  size?: number;
}

export const DonutBreakdownChart: React.FC<DonutBreakdownChartProps> = ({
  data,
  title,
  unit = '',
  size = 180,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = data.reduce((a, b) => a + b.value, 0);

  if (total === 0 || data.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center text-xs text-neutral-500">
        No distribution data
      </div>
    );
  }

  const radius = size / 2 - 16;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const slices = data.map((d, i) => {
    const percent = d.value / total;
    const strokeDasharray = `${circumference * percent} ${circumference * (1 - percent)}`;
    const strokeDashoffset = -circumference * cumulativePercent;
    cumulativePercent += percent;
    return { ...d, percent, strokeDasharray, strokeDashoffset, i };
  });

  const activeSlice = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-2">
      {/* Donut graphic */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Base background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#262626"
            strokeWidth={strokeWidth}
          />
          {/* Slices */}
          {slices.map(s => (
            <circle
              key={s.i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={hoveredIdx === s.i ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={s.strokeDasharray}
              strokeDashoffset={s.strokeDashoffset}
              strokeLinecap="butt"
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(s.i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-lg font-bold font-mono text-neutral-100 tabular-nums">
            {activeSlice ? `${activeSlice.value}${unit}` : `${total}${unit}`}
          </span>
          <span className="text-[11px] text-neutral-400 font-medium truncate max-w-[90px]">
            {activeSlice ? activeSlice.label : (title || 'Total')}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 grid grid-cols-1 gap-2 w-full text-xs">
        {data.map((d, i) => {
          const pct = Math.round((d.value / total) * 100);
          const isHovered = hoveredIdx === i;
          return (
            <div
              key={i}
              className={`flex items-center justify-between p-1.5 rounded-md cursor-pointer transition-colors ${
                isHovered ? 'bg-neutral-800/60' : 'hover:bg-neutral-900'
              }`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-neutral-300 font-medium truncate">{d.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums text-neutral-400 shrink-0">
                <span>{d.value}{unit}</span>
                <span className="text-[11px] text-neutral-400">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
