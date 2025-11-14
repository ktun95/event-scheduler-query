import React from 'react';

interface QueryStatsProps {
  queryTimeMs: number | null;
  resultCount: number;
}

const QueryStats: React.FC<QueryStatsProps> = ({ queryTimeMs, resultCount }) => {
  if (queryTimeMs === null) {
    return null;
  }

  // Format time with appropriate precision and units
  const formatTime = (ms: number): { value: string; unit: string } => {
    if (ms < 0.01) {
      // Show in microseconds if less than 0.01ms
      const microseconds = ms * 1000;
      return {
        value: microseconds.toFixed(2),
        unit: 'µs'
      };
    } else if (ms < 1) {
      // Show 3 decimal places for sub-millisecond
      return {
        value: ms.toFixed(3),
        unit: 'ms'
      };
    } else {
      // Show 2 decimal places for >= 1ms
      return {
        value: ms.toFixed(2),
        unit: 'ms'
      };
    }
  };

  const { value, unit } = formatTime(queryTimeMs);

  return (
    <div className="flex items-center justify-between bg-gray-800/30 px-4 py-2 rounded-lg border border-gray-700 text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Query Time:</span>
          <span className="font-mono text-green-400 font-semibold">
            {value}{unit}
          </span>
        </div>
        <div className="w-px h-4 bg-gray-600" />
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Results:</span>
          <span className="font-mono text-blue-400 font-semibold">
            {resultCount}
          </span>
        </div>
      </div>
      {queryTimeMs < 1 && (
        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">
          ⚡ Lightning Fast
        </span>
      )}
    </div>
  );
};

export default QueryStats;
