import React from 'react';

/**
 * Ensures the 'rf' letter pair in 'performance' / 'Performance' has consistent spacing.
 */
export function formatPerformanceText(text: string): React.ReactNode {
  if (!text || typeof text !== 'string' || !/pe[rR]fo/i.test(text)) {
    return text;
  }
  const parts = text.split(/(pe)(r)(formance)/gi);
  if (parts.length <= 1) return text;

  const result: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i % 4 === 1) {
      const pe = parts[i];
      const r = parts[i + 1];
      const formance = parts[i + 2];
      result.push(
        <span key={i} className="word-performance">
          {pe}<span className="rf-fix">{r}</span>{formance}
        </span>
      );
      i += 2;
    } else {
      result.push(parts[i]);
    }
  }
  return <>{result}</>;
}
