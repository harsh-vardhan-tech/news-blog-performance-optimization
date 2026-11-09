import React from 'react';
import { Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react';

interface ConnectivityBarProps {
  isThrottled: boolean;
  onToggleThrottle: () => void;
  isLoading: boolean;
  loadingProgress: number;
  onTriggerBatchPurge: () => void;
}

export const ConnectivityBar: React.FC<ConnectivityBarProps> = React.memo(({
  isThrottled,
  onToggleThrottle,
  isLoading,
  loadingProgress,
  onTriggerBatchPurge,
}) => {
  return (
    <div
      role="region"
      aria-label="Network Connectivity & Simulation Controls"
      className="bg-white border border-zinc-200 p-4"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Network simulation toggles */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isThrottled}
              onChange={onToggleThrottle}
              aria-label="Simulate slow 3G connection"
              className="w-4 h-4 text-black border-zinc-300 rounded focus:ring-black cursor-pointer"
            />
            <span className="text-sm font-medium text-zinc-900 flex items-center gap-1.5">
              {isThrottled ? (
                <WifiOff className="w-4 h-4 text-zinc-700" aria-hidden="true" />
              ) : (
                <Wifi className="w-4 h-4 text-zinc-700" aria-hidden="true" />
              )}
              Simulate slow 3G connection
            </span>
          </label>

          <span className="text-xs px-2.5 py-1 bg-zinc-100 border border-zinc-200 font-mono text-zinc-700">
            {isThrottled ? 'Network: Emulated 3G (~1500ms RTT)' : 'Network: High-Speed Fiber'}
          </span>
        </div>

        {/* Right: Batch Action Button */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onTriggerBatchPurge}
            disabled={isLoading}
            aria-label="Run full CDN purge & audit"
            className="inline-flex items-center px-4 py-2 border border-zinc-900 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Auditing System...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                Run full CDN purge & audit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Loading Indicator / Progress Bar */}
      {isLoading && (
        <div className="mt-4 pt-3 border-t border-zinc-200" aria-live="polite">
          <div className="flex justify-between text-xs text-zinc-600 mb-1.5">
            <span className="font-medium">
              {isThrottled
                ? 'Simulating slow 3G transmission and edge cache synchronization...'
                : 'Synchronizing performance audit records across edge nodes...'}
            </span>
            <span className="font-mono font-medium">{loadingProgress}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={loadingProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Optimization progress"
            className="w-full bg-zinc-100 h-2 overflow-hidden border border-zinc-200"
          >
            <div
              className="bg-black h-2 transition-all duration-200"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

ConnectivityBar.displayName = 'ConnectivityBar';
