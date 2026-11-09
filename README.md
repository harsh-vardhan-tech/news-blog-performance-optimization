# Performance Optimization Hub — News Blog
**Ticket ID**: `ENG-84718` | **Epic**: Core Infrastructure Overhaul | **Priority**: P1 (High)  
**Primary Owner**: Harsh Vardhan `[PDIT-INT-1260]`  
**Assigned By**: Deepika Kumari (Tech Lead) | **Reporter**: Amit Sharma (Senior Staff Engineer)

---

## 1. Overview
The **Performance Optimization Hub** is an enterprise-grade digital dashboard built for the floor staff at **News Blog**. It replaces error-prone manual paper notes and spreadsheets with a unified, high-performance monitoring and optimization interface.

---

## 2. Key Features

### Happy Path (Core Functionality)
- **Real-Time Key Metrics Overview**:
  - Average Time to First Byte (TTFB).
  - Largest Contentful Paint (LCP) status.
  - CDN Edge Cache Hit Rate.
  - Total payload tracked across all monitored news endpoints.
- **Instant Floor Staff Actions**:
  - One-click asset optimization (Brotli/Gzip compression, responsive image optimization).
  - Global CDN cache purge and edge synchronization.
- **Search, Filter & Sort**:
  - Search articles by title, route/slug, or floor staff notes.
  - Filter by category (`Breaking News`, `Technology`, `Politics`, `Sports`, `Opinion`, `Investigative`).
  - Filter by status (`Optimized`, `Needs Optimization`, `Critical Latency`, `Auditing`).
  - Sort by TTFB latency, payload size (KB), LCP, or timestamp.

### Unhappy Path (Resilience & Edge Cases)
- **Empty States**: Friendly "No data found" screen when filters or search queries return no results, complete with a one-click "Reset filters" button (never a blank screen).
- **Network Resilience / Slow 3G Simulation**: Toggleable slow 3G simulation (~1500ms RTT) with an accessible visual progress bar (`role="progressbar"`) and status notifications during async operations.
- **Strict Form Validation**: Prevents submission of incomplete or malformed records; offending fields are marked with `aria-invalid="true"` and outlined with red borders alongside descriptive error hints.

### Non-Functional Requirements (NFRs)
- **Accessibility (a11y)**: Built with semantic HTML, full keyboard navigation (`Tab`, `Space`, `Enter`), high-contrast focus rings, and comprehensive ARIA roles.
- **Telemetry Simulation**: Fires standardized console analytics logs on primary user interactions:
  `[Analytics] User interacted with Performance Optimization: <Action>`
- **Security (XSS Prevention)**: All textual inputs are sanitized using `DOMPurify` before being committed to state.
- **React Performance**: Heavy computations are wrapped in `useMemo`, and event handlers are stabilized with `useCallback` to prevent unnecessary re-renders.
- **Design System**: Strict monochromatic corporate design system (blacks, whites, neutral slates/grays, 16px / 32px spacing steps) with semantic red restricted strictly to validation errors.

---

## 3. Project Structure

```
├── PROMPTS.md                               # Prompt engineering audit trail (Mandatory deliverable)
├── README.md                                # Project documentation & technical guide
├── package.json                             # Dependencies & scripts
├── vite.config.ts                           # Vite 8 & Vitest configuration
├── src/
│   ├── types/
│   │   └── performance.ts                   # Strongly-typed data schemas
│   ├── utils/
│   │   ├── security.ts                      # DOMPurify XSS sanitization & URL validation
│   │   └── telemetry.ts                     # Simulated analytics logger
│   ├── data/
│   │   └── mockPerformanceData.ts           # Realistic News Blog article performance records
│   ├── components/
│   │   └── PerformanceOptimization/
│   │       ├── PerformanceOptimization.tsx  # Main orchestrator (useMemo & useCallback)
│   │       ├── MetricsOverview.tsx          # Key metrics cards
│   │       ├── ConnectivityBar.tsx          # Slow 3G network simulation & progress bar
│   │       ├── FilterBar.tsx                # Monochromatic search, filter & sort controls
│   │       ├── PerformanceTable.tsx         # Accessible data grid with instant optimization
│   │       ├── AddAuditModal.tsx            # Form with red validation errors & XSS sanitization
│   │       └── EmptyState.tsx               # Friendly "No data found" with reset action
│   ├── __tests__/
│   │   └── PerformanceOptimization.test.tsx # 13 comprehensive TDD Vitest test cases
│   └── test/
│       └── setup.ts                         # @testing-library/jest-dom setup
```

---

## 4. Development & Testing Commands

### Install Dependencies
```bash
npm install
```

### Run Tests (Vitest)
```bash
npm test
```

### Run Linter (Oxlint / ESLint)
```bash
npm run lint
```

### Production Build
```bash
npm run build
```

### Start Development Server
```bash
npm run dev
```

---

## 5. Definition of Done (DoD) Verification
- [x] Code compiles and runs successfully without fatal errors (`npm run build`).
- [x] Passes Linting with **zero** warnings and **zero** errors (`npm run lint`).
- [x] All 13 Vitest tests pass cleanly covering Happy Path, Unhappy Path, and NFRs (`npm test`).
- [x] `PROMPTS.md` audit log included in the root directory.
- [x] Zero hardcoded API keys or sensitive PII in source.
