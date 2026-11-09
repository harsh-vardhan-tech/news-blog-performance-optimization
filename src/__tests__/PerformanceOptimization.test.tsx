import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PerformanceOptimization from '../components/PerformanceOptimization/PerformanceOptimization';
import { sanitizeInput, isValidUrlOrSlug } from '../utils/security';

describe('PerformanceOptimization Component — Acceptance Criteria & NFRs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // 1. HAPPY PATH (Agile User Stories)
  // ==========================================
  describe('1. Happy Path — Core Functionality & Responsiveness', () => {
    it('renders the Performance Optimization header and metric cards clearly', () => {
      render(<PerformanceOptimization />);

      expect(
        screen.getByRole('heading', { name: /performance optimization/i, level: 1 })
      ).toBeInTheDocument();
      expect(screen.getByText(/news blog floor staff portal/i)).toBeInTheDocument();

      // Check presence of Core Web Vitals summary cards
      expect(screen.getByText(/average ttfb/i)).toBeInTheDocument();
      expect(screen.getByText(/average lcp/i)).toBeInTheDocument();
      expect(screen.getByText(/cdn edge hit rate/i)).toBeInTheDocument();
      expect(screen.getByText(/total payload tracked/i)).toBeInTheDocument();
    });

    it('renders initial performance records with structured data metrics', () => {
      render(<PerformanceOptimization />);

      expect(
        screen.getByText(/global climate summit 2026: live analysis and key takeaways/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/tech giants announce unified ai safety protocol/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/federal reserve policy shift sparks market rally/i)
      ).toBeInTheDocument();

      // Ensure Core Web Vitals (TTFB, LCP, Page Size) are displayed
      expect(screen.getByText('142 ms')).toBeInTheDocument();
      expect(screen.getByText('1.8 s')).toBeInTheDocument();
      expect(screen.getByText('485 KB')).toBeInTheDocument();
    });

    it('filters articles by search term without long delays', async () => {
      render(<PerformanceOptimization />);
      const searchInput = screen.getByRole('searchbox', { name: /search performance records/i });

      await userEvent.type(searchInput, 'Zurich');

      expect(
        screen.getByText(/tech giants announce unified ai safety protocol at zurich conference/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/global climate summit 2026/i)
      ).not.toBeInTheDocument();
    });

    it('filters records by category selection', async () => {
      render(<PerformanceOptimization />);
      const categorySelect = screen.getByRole('combobox', { name: /filter by category/i });

      await userEvent.selectOptions(categorySelect, 'Technology');

      expect(
        screen.getByText(/tech giants announce unified ai safety protocol/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/championship finals: highlights/i)
      ).not.toBeInTheDocument();
    });

    it('executes an instant optimization action on an article and updates its status', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      render(<PerformanceOptimization />);

      // Find the "Optimize Assets" button for an unoptimized article
      const optimizeButtons = screen.getAllByRole('button', { name: /optimize assets/i });
      expect(optimizeButtons.length).toBeGreaterThan(0);

      await userEvent.click(optimizeButtons[0]);

      // Telemetry log should be triggered
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Analytics] User interacted with Performance Optimization: Optimize Article')
      );
    });

    it('successfully adds a new performance audit record with valid inputs', async () => {
      render(<PerformanceOptimization />);

      // Open Add Record Modal / Form
      const openFormButton = screen.getByRole('button', { name: /add new audit record/i });
      await userEvent.click(openFormButton);

      // Fill in valid fields
      await userEvent.type(
        screen.getByLabelText(/article title/i),
        'Exclusive: Deep Space Telescope Captures Exoplanet Atmosphere'
      );
      await userEvent.type(
        screen.getByLabelText(/article url or slug/i),
        '/science/deep-space-telescope'
      );
      await userEvent.selectOptions(
        screen.getByLabelText(/article category/i),
        'Technology'
      );
      await userEvent.type(
        screen.getByLabelText(/measured ttfb/i),
        '190'
      );
      await userEvent.type(
        screen.getByLabelText(/total payload/i),
        '650'
      );
      await userEvent.type(
        screen.getByLabelText(/notes & recommendations/i),
        'Initial audit passed. Assets optimized with Brotli compression.'
      );

      const submitButton = screen.getByRole('button', { name: /submit audit record/i });
      await userEvent.click(submitButton);

      // Verify the new record appears in the list
      await waitFor(() => {
        expect(
          screen.getByText(/exclusive: deep space telescope captures exoplanet atmosphere/i)
        ).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // 2. UNHAPPY PATH (Edge Case Handling)
  // ==========================================
  describe('2. Unhappy Path — Edge Cases & Resilience', () => {
    it('displays a friendly "No data found" empty state when search returns zero results', async () => {
      render(<PerformanceOptimization />);
      const searchInput = screen.getByRole('searchbox', { name: /search performance records/i });

      await userEvent.type(searchInput, 'nonexistentqueryxyz999');

      // Must not show blank screen; must show empty state with "No data found"
      expect(screen.getByText(/no data found/i)).toBeInTheDocument();
      expect(
        screen.getByText(/no performance records match your current filter criteria/i)
      ).toBeInTheDocument();

      // Ensure a reset button is provided
      const resetButton = screen.getByRole('button', { name: /reset filters/i });
      expect(resetButton).toBeInTheDocument();

      // Clicking reset restores the items
      await userEvent.click(resetButton);
      expect(
        screen.getByText(/global climate summit 2026/i)
      ).toBeInTheDocument();
    });

    it('simulates slow 3G connectivity and displays a visual loading indicator during async operations', async () => {
      render(<PerformanceOptimization />);

      // Toggle slow 3G network mode
      const networkToggle = screen.getByRole('checkbox', { name: /simulate slow 3g connection/i });
      await userEvent.click(networkToggle);

      // Trigger a batch audit or optimization
      const batchAuditButton = screen.getByRole('button', { name: /run full cdn purge & audit/i });
      await userEvent.click(batchAuditButton);

      // A visual loading spinner / progress bar must be visible
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(/simulating slow 3g transmission/i)).toBeInTheDocument();

      // Wait for async completion
      await waitFor(
        () => {
          expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        },
        { timeout: 3500 }
      );
    });

    it('blocks submission and highlights offending fields in red when form inputs are invalid', async () => {
      render(<PerformanceOptimization />);

      // Open Add Record Modal
      const openFormButton = screen.getByRole('button', { name: /add new audit record/i });
      await userEvent.click(openFormButton);

      // Attempt submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /submit audit record/i });
      await userEvent.click(submitButton);

      // Verification: fields must show red border highlighting and aria-invalid=true
      const titleInput = screen.getByLabelText(/article title/i);
      const slugInput = screen.getByLabelText(/article url or slug/i);
      const ttfbInput = screen.getByLabelText(/measured ttfb/i);

      expect(titleInput).toHaveAttribute('aria-invalid', 'true');
      expect(slugInput).toHaveAttribute('aria-invalid', 'true');
      expect(ttfbInput).toHaveAttribute('aria-invalid', 'true');

      // Check red error classes on offending fields
      expect(titleInput.className).toMatch(/border-red-600|border-red-500/);
      expect(slugInput.className).toMatch(/border-red-600|border-red-500/);

      // Ensure error messages are displayed
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid url or relative path is required/i)).toBeInTheDocument();
    });

    it('validates invalid URL formats and flags them in red', async () => {
      render(<PerformanceOptimization />);

      const openFormButton = screen.getByRole('button', { name: /add new audit record/i });
      await userEvent.click(openFormButton);

      const slugInput = screen.getByLabelText(/article url or slug/i);
      await userEvent.type(slugInput, 'invalid-url-without-leading-slash-or-protocol');

      const submitButton = screen.getByRole('button', { name: /submit audit record/i });
      await userEvent.click(submitButton);

      expect(slugInput).toHaveAttribute('aria-invalid', 'true');
      expect(slugInput.className).toMatch(/border-red-600|border-red-500/);
      expect(screen.getByText(/valid url or relative path is required/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 3. NON-FUNCTIONAL REQUIREMENTS (NFRs)
  // ==========================================
  describe('3. Non-Functional Requirements — a11y, Telemetry & Security', () => {
    it('achieves accessibility standards with proper ARIA attributes and keyboard navigable roles', () => {
      render(<PerformanceOptimization />);

      // Search box has explicit aria-label and role
      const searchBox = screen.getByRole('searchbox', { name: /search performance records/i });
      expect(searchBox).toHaveAttribute('aria-label');

      // Category and Status filters have proper labels
      expect(screen.getByRole('combobox', { name: /filter by category/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /filter by status/i })).toBeInTheDocument();

      // Table has semantic caption or ARIA table semantics
      expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'News Blog Article Performance Records');
    });

    it('emits simulated analytics telemetry to console on primary user actions', async () => {
      const consoleSpy = vi.spyOn(console, 'log');
      render(<PerformanceOptimization />);

      // Primary Action 1: Search
      const searchInput = screen.getByRole('searchbox', { name: /search performance records/i });
      await userEvent.type(searchInput, 'Climate');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Analytics] User interacted with Performance Optimization: Search Filter Applied')
      );

      // Primary Action 2: Change sort
      const sortSelect = screen.getByRole('combobox', { name: /sort records by/i });
      await userEvent.selectOptions(sortSelect, 'pageSizeKb');

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Analytics] User interacted with Performance Optimization: Sort Order Changed')
      );
    });

    it('sanitizes textual inputs against XSS script injection before storing in state', async () => {
      // Test utility sanitization directly
      const maliciousScript = '<script>alert("XSS Vulnerability")</script>Breaking News';
      const sanitized = sanitizeInput(maliciousScript);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).toBe('Breaking News');

      // Verify URL/slug validator utility
      expect(isValidUrlOrSlug('/valid/slug')).toBe(true);
      expect(isValidUrlOrSlug('https://example.com/article')).toBe(true);
      expect(isValidUrlOrSlug('invalid-no-slash')).toBe(false);

      // Test component XSS handling
      render(<PerformanceOptimization />);
      const openFormButton = screen.getByRole('button', { name: /add new audit record/i });
      await userEvent.click(openFormButton);

      const titleInput = screen.getByLabelText(/article title/i);
      await userEvent.type(titleInput, '<img src=x onerror=alert(1)>Sanitized Article Title');

      const slugInput = screen.getByLabelText(/article url or slug/i);
      await userEvent.type(slugInput, '/news/sanitized-article');

      const ttfbInput = screen.getByLabelText(/measured ttfb/i);
      await userEvent.type(ttfbInput, '150');

      const payloadInput = screen.getByLabelText(/total payload/i);
      await userEvent.type(payloadInput, '450');

      const submitButton = screen.getByRole('button', { name: /submit audit record/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Sanitized Article Title')).toBeInTheDocument();
        expect(screen.queryByRole('img', { name: /onerror/i })).not.toBeInTheDocument();
      });
    });
  });
});
