import React, { useState } from 'react';

interface ScatterPoint {
  x: number;
  y: number;
  label: string;
}

interface ScatterCorrelationChartProps {
  points: ScatterPoint[];
  correlationScore: number; // -1 to 1
  xLabel: string;
  yLabel: string;
  title: string;
  description: string;
}

export const ScatterCorrelationChart: React.FC<ScatterCorrelationChartProps> = ({
  points,
  correlationScore,
  xLabel,
  yLabel,
  title,
  description,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ScatterPoint | null>(null);

  if (!points || points.length === 0) {
    return <div className="p-4 text-xs text-neutral-500">No correlation data available</div>;
  }

  const xVals = points.map(p => p.x);
  const yVals = points.map(p => p.y);

  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const width = 500;
  const height = 240;
  const padLeft = 45;
  const padBottom = 35;
  const padTop = 20;
  const padRight = 20;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const mappedPoints = points.map(p => {
    const cx = padLeft + ((p.x - minX) / rangeX) * chartW;
    const cy = padTop + chartH - ((p.y - minY) / rangeY) * chartH;
    return { ...p, cx, cy };
  });

  // Calculate Simple Linear Regression trendline
  const n = points.length;
  const meanX = xVals.reduce((a, b) => a + b, 0) / n;
  const meanY = yVals.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xVals[i] - meanX) * (yVals[i] - meanY);
    den += (xVals[i] - meanX) * (xVals[i] - meanX);
  }
  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;

  const lineStartValY = slope * minX + intercept;
  const lineEndValY = slope * maxX + intercept;

  const lineStartX = padLeft;
  const lineStartY = padTop + chartH - ((lineStartValY - minY) / rangeY) * chartH;
  const lineEndX = padLeft + chartW;
  const lineEndY = padTop + chartH - ((lineEndValY - minY) / rangeY) * chartH;

  const correlationStrength =
    Math.abs(correlationScore) > 0.6
      ? 'Strong'
      : Math.abs(correlationScore) > 0.3
      ? 'Moderate'
      : 'Weak';
  const correlationDirection = correlationScore > 0 ? 'Positive' : correlationScore < 0 ? 'Negative' : 'Neutral';

  return (
    <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-neutral-200">{title}</h4>
          <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs font-mono font-bold text-indigo-400 tabular-nums">
            r = {correlationScore > 0 ? `+${correlationScore}` : correlationScore}
          </div>
          <div className="text-[11px] text-neutral-400">
            {correlationStrength} {correlationDirection}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Axis lines */}
          <line x1={padLeft} y1={padTop + chartH} x2={width - padRight} y2={padTop + chartH} stroke="#404040" strokeWidth="1" />
          <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + chartH} stroke="#404040" strokeWidth="1" />

          {/* Y ticks */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = padTop + chartH * (1 - ratio);
            const val = Math.round(minY + rangeY * ratio);
            return (
              <g key={i}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#262626" strokeDasharray="3 3" />
                <text x={padLeft - 6} y={y + 3} fill="#737373" fontSize="9" textAnchor="end" className="font-mono tabular-nums">
                  {val}
                </text>
              </g>
            );
          })}

          {/* X ticks */}
          {[0, 0.5, 1].map((ratio, i) => {
            const x = padLeft + chartW * ratio;
            const val = Math.round((minX + rangeX * ratio) * 10) / 10;
            return (
              <text key={i} x={x} y={padTop + chartH + 14} fill="#737373" fontSize="9" textAnchor="middle" className="font-mono tabular-nums">
                {val}
              </text>
            );
          })}

          {/* Axis Labels */}
          <text x={padLeft + chartW / 2} y={height - 4} fill="#a3a3a3" fontSize="10" textAnchor="middle" className="font-medium">
            {xLabel}
          </text>
          <text
            x={-height / 2 + 10}
            y={12}
            fill="#a3a3a3"
            fontSize="10"
            textAnchor="middle"
            transform="rotate(-90)"
            className="font-medium"
          >
            {yLabel}
          </text>

          {/* Regression Line */}
          <line
            x1={lineStartX}
            y1={Math.max(padTop, Math.min(padTop + chartH, lineStartY))}
            x2={lineEndX}
            y2={Math.max(padTop, Math.min(padTop + chartH, lineEndY))}
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Scatter Points */}
          {mappedPoints.map((p, i) => {
            const isHovered = hoveredPoint?.label === p.label;
            return (
              <circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#ffffff' : '#6366f1'}
                stroke="#0a0a0a"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* Hover popup */}
          {hoveredPoint && (
            <g transform={`translate(${padLeft + chartW / 2}, ${padTop + 14})`}>
              <rect x="-60" y="-12" width="120" height="24" rx="4" fill="#0a0a0a" stroke="#525252" />
              <text x="0" y="4" fill="#f5f5f5" fontSize="10" textAnchor="middle" className="font-mono tabular-nums">
                {hoveredPoint.label}: {hoveredPoint.x} | {hoveredPoint.y}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="text-[11px] text-neutral-400 italic">
        Statistical observation note: Identifies statistical correlation across past 14 days of recorded logs. Does not assume causality.
      </div>
    </div>
  );
};
