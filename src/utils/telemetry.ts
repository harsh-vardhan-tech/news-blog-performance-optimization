/**
 * Dispatches client-side analytics logging on primary user interactions.
 */
export function logTelemetry(actionDescription: string, metadata?: Record<string, unknown>): void {
  const metaSuffix = metadata && Object.keys(metadata).length > 0
    ? ` - ${JSON.stringify(metadata)}`
    : '';

  console.log(
    `[Analytics] User interacted with Performance Optimization: ${actionDescription}${metaSuffix}`
  );
}
