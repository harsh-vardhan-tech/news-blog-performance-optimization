/**
 * Dispatches simulated telemetry logging required by Non-Functional Requirements (NFR-2).
 * Strictly logs formatted message matching '[Analytics] User interacted with Performance Optimization'.
 */
export function logTelemetry(actionDescription: string, metadata?: Record<string, unknown>): void {
  const metaSuffix = metadata && Object.keys(metadata).length > 0
    ? ` - ${JSON.stringify(metadata)}`
    : '';

  console.log(
    `[Analytics] User interacted with Performance Optimization: ${actionDescription}${metaSuffix}`
  );
}
