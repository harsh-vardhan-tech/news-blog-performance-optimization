import React from 'react';
import { Search, ArrowUpDown, Plus, Filter } from 'lucide-react';
import type { OptimizationFilterCriteria } from '../../types/performance';

interface FilterBarProps {
  filters: OptimizationFilterCriteria;
  onFilterChange: <K extends keyof OptimizationFilterCriteria>(
    key: K,
    value: OptimizationFilterCriteria[K]
  ) => void;
  onOpenAddModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = React.memo(({
  filters,
  onFilterChange,
  onOpenAddModal,
}) => {
  return (
    <div
      role="search"
      aria-label="Performance Filter & Search Controls"
      className="bg-white border border-zinc-200 p-4 space-y-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" aria-hidden="true" />
          </div>
          <input
            type="search"
            role="searchbox"
            aria-label="Search performance records"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            placeholder="Search by article title, slug, or keywords..."
            className="w-full pl-10 pr-4 py-2 border border-zinc-300 bg-white text-zinc-900 text-sm placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Action Button: Add New Record */}
        <button
          type="button"
          onClick={onOpenAddModal}
          aria-label="Add new audit record"
          className="inline-flex items-center justify-center px-4 py-2 border border-black bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Add new audit record
        </button>
      </div>

      {/* Filter and Sort Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-zinc-100">
        {/* Category Filter */}
        <div className="flex flex-col">
          <label htmlFor="filter-category" className="text-xs font-semibold text-zinc-600 mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-zinc-500" />
            Category
          </label>
          <select
            id="filter-category"
            aria-label="Filter by category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-300 bg-white text-zinc-900 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="All">All Categories</option>
            <option value="Breaking News">Breaking News</option>
            <option value="Technology">Technology</option>
            <option value="Politics">Politics</option>
            <option value="Sports">Sports</option>
            <option value="Opinion">Opinion</option>
            <option value="Investigative">Investigative</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col">
          <label htmlFor="filter-status" className="text-xs font-semibold text-zinc-600 mb-1">
            Status
          </label>
          <select
            id="filter-status"
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-1.5 border border-zinc-300 bg-white text-zinc-900 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="All">All Statuses</option>
            <option value="Optimized">Optimized</option>
            <option value="Needs Optimization">Needs Optimization</option>
            <option value="Critical Latency">Critical Latency</option>
            <option value="Auditing">Auditing</option>
          </select>
        </div>

        {/* Sort By Field */}
        <div className="flex flex-col">
          <label htmlFor="sort-records-by" className="text-xs font-semibold text-zinc-600 mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-500" />
            Sort By
          </label>
          <select
            id="sort-records-by"
            aria-label="Sort records by"
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange('sortBy', e.target.value as OptimizationFilterCriteria['sortBy'])
            }
            className="w-full px-3 py-1.5 border border-zinc-300 bg-white text-zinc-900 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="ttfbMs">Time to First Byte (TTFB)</option>
            <option value="pageSizeKb">Payload Size (KB)</option>
            <option value="lcpSeconds">Largest Contentful Paint (LCP)</option>
            <option value="lastAuditedAt">Audit Timestamp</option>
          </select>
        </div>

        {/* Sort Order Direction */}
        <div className="flex flex-col">
          <label htmlFor="sort-direction" className="text-xs font-semibold text-zinc-600 mb-1">
            Sort Direction
          </label>
          <select
            id="sort-direction"
            aria-label="Sort direction"
            value={filters.sortOrder}
            onChange={(e) =>
              onFilterChange('sortOrder', e.target.value as 'asc' | 'desc')
            }
            className="w-full px-3 py-1.5 border border-zinc-300 bg-white text-zinc-900 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
          >
            <option value="asc">Ascending (Low to High)</option>
            <option value="desc">Descending (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';
