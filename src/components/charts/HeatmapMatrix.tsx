import React from 'react';

interface HeatmapCell {
  date: string; // YYYY-MM-DD
  count: number;
  completed: boolean;
}

interface HeatmapMatrixProps {
  habitName: string;
  streak: number;
  data: HeatmapCell[];
  onToggle?: (date: string) => void;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  habitName,
  streak,
  data,
  onToggle,
}) => {
  return (
    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-200">{habitName}</span>
          <span className="text-xs text-amber-400 font-mono tabular-nums">
            {streak}d streak
          </span>
        </div>
        <span className="text-xs text-neutral-500 font-mono">Past 14 Days</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        {data.map((cell, i) => {
          const isToday = i === data.length - 1;
          return (
            <button
              key={cell.date}
              onClick={() => onToggle && onToggle(cell.date)}
              title={`${cell.date}: ${cell.completed ? 'Completed' : 'Missed'}`}
              className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono transition-all ${
                cell.completed
                  ? 'bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              } ${isToday ? 'ring-1 ring-white/40' : ''}`}
            >
              {cell.date.slice(-2)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
