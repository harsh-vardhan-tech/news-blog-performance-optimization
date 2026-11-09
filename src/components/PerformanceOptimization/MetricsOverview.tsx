import React from 'react';
import { Gauge, Cpu, CloudLightning, HardDrive } from 'lucide-react';

interface MetricsOverviewProps {
  averageTtfb: number;
  averageLcp: number;
  averageEdgeHitRate: number;
  totalPayloadKb: number;
  totalRecordsCount: number;
  optimizedCount: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = React.memo(({
  averageTtfb,
  averageLcp,
  averageEdgeHitRate,
  totalPayloadKb,
  totalRecordsCount,
  optimizedCount,
}) => {
  const formattedPayload = totalPayloadKb > 1024
    ? `${(totalPayloadKb / 1024).toFixed(1)} MB`
    : `${totalPayloadKb} KB`;

  const optimizationRatio = totalRecordsCount > 0
    ? Math.round((optimizedCount / totalRecordsCount) * 100)
    : 0;

  return (
    <section
      aria-label="Core Performance Key Metrics"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {/* Metric Card 1: Average TTFB */}
      <div className="bg-white border border-zinc-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
            Average TTFB
          </span>
          <Gauge className="w-4 h-4 text-zinc-700" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900">
          {averageTtfb} ms
        </div>
        <div className="mt-2 text-xs text-zinc-500 flex items-center justify-between">
          <span>Target: &lt; 200 ms</span>
          <span className="font-mono font-medium text-zinc-900">
            {averageTtfb <= 200 ? 'Optimal' : 'Needs Tuning'}
          </span>
        </div>
      </div>

      {/* Metric Card 2: Average LCP */}
      <div className="bg-white border border-zinc-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
            Average LCP
          </span>
          <Cpu className="w-4 h-4 text-zinc-700" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900">
          {averageLcp.toFixed(2)} s
        </div>
        <div className="mt-2 text-xs text-zinc-500 flex items-center justify-between">
          <span>Threshold: &lt; 2.5 s</span>
          <span className="font-mono font-medium text-zinc-900">
            {averageLcp <= 2.5 ? 'Good' : 'Degraded'}
          </span>
        </div>
      </div>

      {/* Metric Card 3: CDN Edge Hit Rate */}
      <div className="bg-white border border-zinc-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
            CDN Edge Hit Rate
          </span>
          <CloudLightning className="w-4 h-4 text-zinc-700" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900">
          {averageEdgeHitRate.toFixed(1)}%
        </div>
        <div className="mt-2 text-xs text-zinc-500 flex items-center justify-between">
          <span>Tier 1 Edge Cache</span>
          <span className="font-mono font-medium text-zinc-900">
            {optimizationRatio}% Optimized
          </span>
        </div>
      </div>

      {/* Metric Card 4: Total Payload Tracked */}
      <div className="bg-white border border-zinc-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-zinc-500">
            Total Payload Tracked
          </span>
          <HardDrive className="w-4 h-4 text-zinc-700" aria-hidden="true" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900">
          {formattedPayload}
        </div>
        <div className="mt-2 text-xs text-zinc-500 flex items-center justify-between">
          <span>{totalRecordsCount} Monitored Endpoints</span>
          <span className="font-mono font-medium text-zinc-900">Active</span>
        </div>
      </div>
    </section>
  );
});

MetricsOverview.displayName = 'MetricsOverview';
