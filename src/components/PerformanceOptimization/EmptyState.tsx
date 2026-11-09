import React from 'react';
import { Database, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({ onReset }) => {
  return (
    <div
      role="status"
      aria-label="Empty search results status"
      className="bg-white border border-zinc-200 p-8 text-center my-4"
    >
      <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-600 mb-4">
        <Database className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-1">
        No data found
      </h3>
      <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
        No performance records match your current filter criteria. Adjust your search terms, clear active filters, or add a new article audit record.
      </p>
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset filters"
        className="inline-flex items-center px-4 py-2 border border-black bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
      >
        <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
        Reset filters
      </button>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
