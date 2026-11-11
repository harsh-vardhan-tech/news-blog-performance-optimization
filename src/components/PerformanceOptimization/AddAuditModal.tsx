import React, { useState, useCallback } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CategoryType, FormValidationErrors, NewPerformanceItemPayload } from '../../types/performance';
import { sanitizeInput, isValidUrlOrSlug } from '../../utils/security';

interface AddAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: NewPerformanceItemPayload) => void;
}

const INITIAL_FORM_STATE = {
  title: '',
  slug: '',
  category: 'Breaking News' as CategoryType,
  ttfbMs: '',
  pageSizeKb: '',
  notes: '',
};

export const AddAuditModal: React.FC<AddAuditModalProps> = React.memo(({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Field change handler
  const handleInputChange = useCallback((
    field: keyof typeof INITIAL_FORM_STATE,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time clearing of error if already attempted
    if (hasAttemptedSubmit) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [hasAttemptedSubmit]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormValidationErrors = {};

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title is required (minimum 5 characters).';
    }

    if (!formData.slug || !isValidUrlOrSlug(formData.slug)) {
      newErrors.slug = 'Valid URL or relative path is required (e.g., /news/article-name or https://...).';
    }

    const ttfbNum = Number(formData.ttfbMs);
    if (!formData.ttfbMs || isNaN(ttfbNum) || ttfbNum <= 0) {
      newErrors.ttfbMs = 'TTFB must be a valid positive integer (ms).';
    }

    const payloadNum = Number(formData.pageSizeKb);
    if (!formData.pageSizeKb || isNaN(payloadNum) || payloadNum <= 0) {
      newErrors.pageSizeKb = 'Payload size must be a positive number (KB).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (validateForm()) {
      onSubmit({
        title: sanitizeInput(formData.title),
        slug: sanitizeInput(formData.slug),
        category: formData.category,
        ttfbMs: Number(formData.ttfbMs),
        pageSizeKb: Number(formData.pageSizeKb),
        notes: sanitizeInput(formData.notes),
      });

      // Reset form
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setHasAttemptedSubmit(false);
      onClose();
    }
  }, [formData, validateForm, onSubmit, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
    >
      <div className="bg-white border border-zinc-200 max-w-xl w-full p-6 sm:p-8 shadow-xl relative animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
          <div>
            <h2 id="modal-title" className="text-xl font-bold tracking-tight text-zinc-900">
              Add New Performance Audit Record
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Input measured metrics for real-time edge monitoring &amp; floor staff optimization.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel and close modal"
            className="text-zinc-500 hover:text-zinc-900 p-1.5 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          {/* Article Title */}
          <div>
            <label
              htmlFor="article-title"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1"
            >
              Article Title <span className="text-red-600">*</span>
            </label>
            <input
              id="article-title"
              type="text"
              aria-label="Article Title"
              aria-required="true"
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Breaking: Global Economic Forum Concludes in Geneva"
              className={`w-full px-3 py-2 text-sm border bg-white text-zinc-900 focus:outline-none focus:ring-1 ${
                errors.title
                  ? 'border-red-600 focus:border-red-600 focus:ring-red-600 text-red-900'
                  : 'border-zinc-300 focus:border-black focus:ring-black'
              }`}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Article URL or Slug */}
          <div>
            <label
              htmlFor="article-slug"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1"
            >
              Article URL or Slug <span className="text-red-600">*</span>
            </label>
            <input
              id="article-slug"
              type="text"
              aria-label="Article URL or Slug"
              aria-required="true"
              aria-invalid={errors.slug ? 'true' : 'false'}
              aria-describedby={errors.slug ? 'slug-error' : undefined}
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="e.g., /news/economic-forum-geneva or https://newsblog.com/..."
              className={`w-full px-3 py-2 text-sm border bg-white text-zinc-900 font-mono text-xs focus:outline-none focus:ring-1 ${
                errors.slug
                  ? 'border-red-600 focus:border-red-600 focus:ring-red-600 text-red-900'
                  : 'border-zinc-300 focus:border-black focus:ring-black'
              }`}
            />
            {errors.slug && (
              <p id="slug-error" className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.slug}
              </p>
            )}
          </div>

          {/* Category & TTFB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="article-category"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1"
              >
                Article Category
              </label>
              <select
                id="article-category"
                aria-label="Article Category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as CategoryType)}
                className="w-full px-3 py-2 text-sm border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              >
                <option value="Breaking News">Breaking News</option>
                <option value="Technology">Technology</option>
                <option value="Politics">Politics</option>
                <option value="Sports">Sports</option>
                <option value="Opinion">Opinion</option>
                <option value="Investigative">Investigative</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="article-ttfb"
                className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1"
              >
                Measured TTFB (ms) <span className="text-red-600">*</span>
              </label>
              <input
                id="article-ttfb"
                type="number"
                aria-label="Measured TTFB"
                aria-required="true"
                aria-invalid={errors.ttfbMs ? 'true' : 'false'}
                aria-describedby={errors.ttfbMs ? 'ttfb-error' : undefined}
                value={formData.ttfbMs}
                onChange={(e) => handleInputChange('ttfbMs', e.target.value)}
                min="1"
                placeholder="150"
                className={`w-full px-3 py-2 text-sm border bg-white text-zinc-900 focus:outline-none focus:ring-1 ${
                  errors.ttfbMs
                    ? 'border-red-600 focus:border-red-600 focus:ring-red-600 text-red-900'
                    : 'border-zinc-300 focus:border-black focus:ring-black'
                }`}
              />
              {errors.ttfbMs && (
                <p id="ttfb-error" className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  {errors.ttfbMs}
                </p>
              )}
            </div>
          </div>

          {/* Payload Size */}
          <div>
            <label
              htmlFor="article-payload"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1"
            >
              Total Payload (KB) <span className="text-red-600">*</span>
            </label>
            <input
              id="article-payload"
              type="number"
              aria-label="Total Payload"
              aria-required="true"
              aria-invalid={errors.pageSizeKb ? 'true' : 'false'}
              aria-describedby={errors.pageSizeKb ? 'payload-error' : undefined}
              value={formData.pageSizeKb}
              onChange={(e) => handleInputChange('pageSizeKb', e.target.value)}
              min="1"
              placeholder="500"
              className={`w-full px-3 py-2 text-sm border bg-white text-zinc-900 focus:outline-none focus:ring-1 ${
                errors.pageSizeKb
                  ? 'border-red-600 focus:border-red-600 focus:ring-red-600 text-red-900'
                  : 'border-zinc-300 focus:border-black focus:ring-black'
              }`}
            />
            {errors.pageSizeKb && (
              <p id="payload-error" className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {errors.pageSizeKb}
              </p>
            )}
          </div>

          {/* Notes & Recommendations */}
          <div>
            <label
              htmlFor="article-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1"
            >
              Notes &amp; Recommendations
            </label>
            <textarea
              id="article-notes"
              rows={3}
              aria-label="Notes & Recommendations"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Record floor staff observations, CDN edge settings, or uncompressed media details..."
              className="w-full px-3 py-2 text-sm border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel and close modal"
              className="px-4 py-2 border border-zinc-300 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              aria-label="Submit audit record"
              className="px-5 py-2 border border-black bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors inline-flex items-center"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Submit audit record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AddAuditModal.displayName = 'AddAuditModal';
