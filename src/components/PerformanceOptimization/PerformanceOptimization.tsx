import React, { useState, useMemo, useCallback } from 'react';
import { INITIAL_PERFORMANCE_ITEMS } from '../../data/mockPerformanceData';
import type {
  PerformanceItem,
  OptimizationFilterCriteria,
  NewPerformanceItemPayload,
} from '../../types/performance';
import { logTelemetry } from '../../utils/telemetry';
import { MetricsOverview } from './MetricsOverview';
import { ConnectivityBar } from './ConnectivityBar';
import { FilterBar } from './FilterBar';
import { PerformanceTable } from './PerformanceTable';
import { EmptyState } from './EmptyState';
import { AddAuditModal } from './AddAuditModal';
import { Activity, ShieldCheck, Clock } from 'lucide-react';

const INITIAL_FILTERS: OptimizationFilterCriteria = {
  searchTerm: '',
  category: 'All',
  status: 'All',
  sortBy: 'ttfbMs',
  sortOrder: 'asc',
};

export const PerformanceOptimization: React.FC = () => {
  const [items, setItems] = useState<PerformanceItem[]>(INITIAL_PERFORMANCE_ITEMS);
  const [filters, setFilters] = useState<OptimizationFilterCriteria>(INITIAL_FILTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const [isThrottled, setIsThrottled] = useState(false);
  const [isAsyncLoading, setIsAsyncLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const computedMetrics = useMemo(() => {
    if (items.length === 0) {
      return {
        averageTtfb: 0,
        averageLcp: 0,
        averageEdgeHitRate: 0,
        totalPayloadKb: 0,
        optimizedCount: 0,
      };
    }

    const totalTtfb = items.reduce((acc, curr) => acc + curr.ttfbMs, 0);
    const totalLcp = items.reduce((acc, curr) => acc + curr.lcpSeconds, 0);
    const totalHitRate = items.reduce((acc, curr) => acc + curr.edgeCacheHitRate, 0);
    const totalPayload = items.reduce((acc, curr) => acc + curr.pageSizeKb, 0);
    const optimized = items.filter((i) => i.status === 'Optimized').length;

    return {
      averageTtfb: Math.round(totalTtfb / items.length),
      averageLcp: Number((totalLcp / items.length).toFixed(2)),
      averageEdgeHitRate: Number((totalHitRate / items.length).toFixed(1)),
      totalPayloadKb: totalPayload,
      optimizedCount: optimized,
    };
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    const { searchTerm, category, status, sortBy, sortOrder } = filters;
    const normalizedQuery = searchTerm.toLowerCase().trim();

    return items
      .filter((item) => {
        const matchesSearch =
          !normalizedQuery ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.slug.toLowerCase().includes(normalizedQuery) ||
          item.notes.toLowerCase().includes(normalizedQuery);

        const matchesCategory = category === 'All' || item.category === category;
        const matchesStatus = status === 'All' || item.status === status;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'ttfbMs') {
          comparison = a.ttfbMs - b.ttfbMs;
        } else if (sortBy === 'pageSizeKb') {
          comparison = a.pageSizeKb - b.pageSizeKb;
        } else if (sortBy === 'lcpSeconds') {
          comparison = a.lcpSeconds - b.lcpSeconds;
        } else if (sortBy === 'lastAuditedAt') {
          comparison = new Date(a.lastAuditedAt).getTime() - new Date(b.lastAuditedAt).getTime();
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [items, filters]);

  const handleFilterChange = useCallback(<K extends keyof OptimizationFilterCriteria>(
    key: K,
    value: OptimizationFilterCriteria[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    if (key === 'searchTerm') {
      logTelemetry('Search Filter Applied', { query: value });
    } else if (key === 'sortBy' || key === 'sortOrder') {
      logTelemetry('Sort Order Changed', { [key]: value });
    } else {
      logTelemetry('Category or Status Filter Changed', { [key]: value });
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    logTelemetry('Reset Filters');
  }, []);

  const handleToggleThrottle = useCallback(() => {
    setIsThrottled((prev) => {
      const nextState = !prev;
      logTelemetry('Toggle Network Simulation', { isSlow3G: nextState });
      return nextState;
    });
  }, []);

  const handleOptimizeItem = useCallback((itemId: string) => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem) return;

    setOptimizingId(itemId);
    logTelemetry('Optimize Article', { id: itemId, title: targetItem.title });

    const delay = isThrottled ? 1200 : 350;

    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              status: 'Optimized',
              ttfbMs: Math.max(110, Math.round(item.ttfbMs * 0.55)),
              lcpSeconds: Number((Math.max(1.2, item.lcpSeconds * 0.6)).toFixed(1)),
              pageSizeKb: Math.max(220, Math.round(item.pageSizeKb * 0.5)),
              edgeCacheHitRate: Math.min(99.4, Number((item.edgeCacheHitRate + 25).toFixed(1))),
              compressionActive: true,
              lastAuditedAt: new Date().toISOString(),
              notes: 'Asset minification and Brotli compression applied.',
            };
          }
          return item;
        })
      );
      setOptimizingId(null);
    }, delay);
  }, [items, isThrottled]);

  const handleTriggerBatchPurge = useCallback(() => {
    setIsAsyncLoading(true);
    setLoadingProgress(10);
    logTelemetry('Batch CDN Purge Triggered', { isThrottled });

    const intervalTime = isThrottled ? 300 : 80;
    let currentProgress = 10;

    const interval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setLoadingProgress(100);

        setTimeout(() => {
          setItems((prev) =>
            prev.map((item) => ({
              ...item,
              status: 'Optimized',
              ttfbMs: Math.max(95, Math.round(item.ttfbMs * 0.7)),
              edgeCacheHitRate: Math.min(99.8, Number((item.edgeCacheHitRate + 15).toFixed(1))),
              compressionActive: true,
              lastAuditedAt: new Date().toISOString(),
            }))
          );
          setIsAsyncLoading(false);
          setLoadingProgress(0);
        }, 150);
      } else {
        setLoadingProgress(currentProgress);
      }
    }, intervalTime);
  }, [isThrottled]);

  const handleAddNewAudit = useCallback((payload: NewPerformanceItemPayload) => {
    const newItem: PerformanceItem = {
      id: `perf-${Date.now()}`,
      title: payload.title,
      slug: payload.slug,
      category: payload.category,
      ttfbMs: payload.ttfbMs,
      lcpSeconds: Number((payload.ttfbMs / 100 + 0.8).toFixed(1)),
      clsScore: 0.03,
      fidMs: 24,
      pageSizeKb: payload.pageSizeKb,
      edgeCacheHitRate: 85.0,
      status: payload.ttfbMs > 400 ? 'Needs Optimization' : 'Optimized',
      lastAuditedAt: new Date().toISOString(),
      compressionActive: true,
      notes: payload.notes || 'Logged by floor staff.',
    };

    setItems((prev) => [newItem, ...prev]);
    logTelemetry('Submit Audit Record', { id: newItem.id, title: newItem.title });
  }, []);

  return (
    <main
      className="min-h-screen bg-zinc-50 text-zinc-900 pb-16 font-sans antialiased"
      role="main"
    >
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm tracking-wider">
              NB
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-none">
                Performance Optimization
              </h1>
              <p className="text-xs text-zinc-500 font-medium mt-1">
                News Blog Floor Staff Portal • Ticket ENG-84718
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-zinc-600">
            <span className="flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1 text-zinc-900" aria-hidden="true" />
              Core Infrastructure Overhaul
            </span>
            <span className="hidden sm:inline text-zinc-300">|</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-zinc-700" aria-hidden="true" />
              Status: Live Production
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <MetricsOverview
          averageTtfb={computedMetrics.averageTtfb}
          averageLcp={computedMetrics.averageLcp}
          averageEdgeHitRate={computedMetrics.averageEdgeHitRate}
          totalPayloadKb={computedMetrics.totalPayloadKb}
          totalRecordsCount={items.length}
          optimizedCount={computedMetrics.optimizedCount}
        />

        <ConnectivityBar
          isThrottled={isThrottled}
          onToggleThrottle={handleToggleThrottle}
          isLoading={isAsyncLoading}
          loadingProgress={loadingProgress}
          onTriggerBatchPurge={handleTriggerBatchPurge}
        />

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onOpenAddModal={() => setIsModalOpen(true)}
        />

        <section aria-label="Performance Audit Records Listing">
          {filteredAndSortedItems.length === 0 ? (
            <EmptyState onReset={handleResetFilters} />
          ) : (
            <PerformanceTable
              items={filteredAndSortedItems}
              onOptimizeItem={handleOptimizeItem}
              optimizingId={optimizingId}
            />
          )}
        </section>

        <footer className="pt-8 border-t border-zinc-200 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-zinc-700" aria-hidden="true" />
            <span>News Blog Internal Infrastructure • Performance Console</span>
          </div>
          <div>
            <span>Targeting 100% Lighthouse a11y Compliance</span>
          </div>
        </footer>
      </div>

      <AddAuditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddNewAudit}
      />
    </main>
  );
};

export default PerformanceOptimization;
