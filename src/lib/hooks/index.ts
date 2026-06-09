// ============================================================
// DreamScape AI — Browser-safe hooks bridge
// Client components import hooks from here instead of directly
// from AI pipelines. On the client, hooks call API routes.
// On the server, they use the AI client directly.
// ============================================================

// Re-export all hooks — they now use API-call fallbacks
export { useRecallAssistant } from './use-recall-assistant';
export { useDreamReconstruction } from './use-dream-reconstruction';
export { useDreamInterpretation } from './use-dream-interpretation';
export { useMovieGeneration } from './use-movie-generation';
export { useAlternateEnding } from './use-alternate-ending';
export { usePatternAnalytics } from './use-pattern-analytics';
export { useMonthlyReport } from './use-monthly-report';