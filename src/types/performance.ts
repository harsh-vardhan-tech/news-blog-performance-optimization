export type CategoryType = 'Breaking News' | 'Politics' | 'Technology' | 'Sports' | 'Opinion' | 'Investigative';

export type OptimizationStatus = 'Optimized' | 'Needs Optimization' | 'Auditing' | 'Critical Latency';

export interface PerformanceMetricAudit {
  ttfbMs: number; // Time to First Byte (ms)
  lcpSeconds: number; // Largest Contentful Paint (s)
  clsScore: number; // Cumulative Layout Shift
  fidMs: number; // First Input Delay (ms)
  pageSizeKb: number; // Total transferred payload (KB)
  edgeCacheHitRate: number; // CDN Edge Hit percentage (0 - 100)
}

export interface PerformanceItem extends PerformanceMetricAudit {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  status: OptimizationStatus;
  lastAuditedAt: string;
  compressionActive: boolean;
  notes: string;
}

export interface NewPerformanceItemPayload {
  title: string;
  slug: string;
  category: CategoryType;
  ttfbMs: number;
  pageSizeKb: number;
  notes: string;
}

export interface FormValidationErrors {
  title?: string;
  slug?: string;
  category?: string;
  ttfbMs?: string;
  pageSizeKb?: string;
  notes?: string;
}

export interface OptimizationFilterCriteria {
  searchTerm: string;
  category: string;
  status: string;
  sortBy: 'ttfbMs' | 'pageSizeKb' | 'lcpSeconds' | 'lastAuditedAt';
  sortOrder: 'asc' | 'desc';
}

export interface NetworkSimulationState {
  isThrottled: boolean;
  latencyMs: number;
  isSimulatingFailure: boolean;
}

