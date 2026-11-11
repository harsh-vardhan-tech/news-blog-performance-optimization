import React from 'react';
import type { PerformanceItem } from '../../types/performance';
import { Zap, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PerformanceTableProps {
  items: PerformanceItem[];
  onOptimizeItem: (id: string) => void;
  optimizingId: string | null;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = React.memo(({
  items,
  onOptimizeItem,
  optimizingId,
}) => {
  return (
    <div className="bg-white border border-zinc-200 overflow-x-auto">
      <table
        className="w-full text-left text-sm border-collapse"
        aria-label="News Blog Article Performance Records"
      >
        <thead className="bg-zinc-100 border-b border-zinc-200 text-xs uppercase font-semibold text-zinc-700 tracking-wider">
          <tr>
            <th scope="col" className="p-4">
              Article &amp; Route
            </th>
            <th scope="col" className="p-4">
              Category
            </th>
            <th scope="col" className="p-4 text-right">
              TTFB
            </th>
            <th scope="col" className="p-4 text-right">
              LCP
            </th>
            <th scope="col" className="p-4 text-right">
              Payload
            </th>
            <th scope="col" className="p-4 text-right">
              Edge Hit
            </th>
            <th scope="col" className="p-4 text-center">
              Status
            </th>
            <th scope="col" className="p-4 text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {items.map((item) => {
            const isCurrentlyOptimizing = optimizingId === item.id;
            const isAlreadyOptimized = item.status === 'Optimized';

            return (
              <tr
                key={item.id}
                className="hover:bg-zinc-50 transition-colors focus-within:bg-zinc-50"
              >
                <td className="p-4 max-w-xs sm:max-w-md">
                  <div className="font-semibold text-zinc-900 line-clamp-1">
                    {item.title}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mt-0.5 truncate">
                    {item.slug}
                  </div>
                  {item.notes && (
                    <div className="text-xs text-zinc-600 mt-1 italic line-clamp-1">
                      Staff note: {item.notes}
                    </div>
                  )}
                </td>

                <td className="p-4 whitespace-nowrap">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium border border-zinc-300 text-zinc-700 bg-zinc-50">
                    {item.category}
                  </span>
                </td>

                <td className="p-4 text-right whitespace-nowrap font-mono">
                  <span
                    className={`font-medium ${
                      item.ttfbMs > 400
                        ? 'text-zinc-900 underline font-bold'
                        : 'text-zinc-700'
                    }`}
                  >
                    {item.ttfbMs} ms
                  </span>
                </td>

                <td className="p-4 text-right whitespace-nowrap font-mono">
                  <span
                    className={`font-medium ${
                      item.lcpSeconds > 3.0
                        ? 'text-zinc-900 underline font-bold'
                        : 'text-zinc-700'
                    }`}
                  >
                    {item.lcpSeconds.toFixed(1)} s
                  </span>
                </td>

                <td className="p-4 text-right whitespace-nowrap font-mono text-zinc-700">
                  {item.pageSizeKb} KB
                </td>

                <td className="p-4 text-right whitespace-nowrap font-mono text-zinc-700">
                  {item.edgeCacheHitRate.toFixed(1)}%
                </td>

                <td className="p-4 text-center whitespace-nowrap">
                  {item.status === 'Optimized' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider bg-black text-white">
                      <ShieldCheck className="w-3 h-3 mr-1" aria-hidden="true" />
                      Optimized
                    </span>
                  )}
                  {item.status === 'Needs Optimization' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border border-zinc-400 text-zinc-800 bg-zinc-100">
                      Needs Optimization
                    </span>
                  )}
                  {item.status === 'Critical Latency' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border-2 border-black bg-zinc-200 text-black">
                      <AlertTriangle className="w-3 h-3 mr-1" aria-hidden="true" />
                      Critical Latency
                    </span>
                  )}
                  {item.status === 'Auditing' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-zinc-600 border border-dashed border-zinc-400">
                      Auditing
                    </span>
                  )}
                </td>

                <td className="p-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onOptimizeItem(item.id)}
                    disabled={isCurrentlyOptimizing || isAlreadyOptimized}
                    aria-label={
                      isAlreadyOptimized
                        ? `Optimal state for ${item.title}`
                        : `Optimize assets for ${item.title}`
                    }
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-colors border ${
                      isAlreadyOptimized
                        ? 'border-zinc-200 text-zinc-400 bg-zinc-50 cursor-default'
                        : 'border-black bg-black text-white hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-black'
                    }`}
                  >
                    {isCurrentlyOptimizing ? (
                      'Optimizing...'
                    ) : isAlreadyOptimized ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                        Optimal
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                        Optimize Assets
                      </>
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

PerformanceTable.displayName = 'PerformanceTable';
