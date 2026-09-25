export type Violation = {
  sink: string;
  sample: string;
  source: string;
  disposition: string;
};

export const violations: Violation[] = [];
const listeners = new Set<() => void>();

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

document.addEventListener('securitypolicyviolation', event => {
  const [sink = '', ...rest] = event.sample.split('|');
  violations.push({
    sink,
    sample: rest.join('|'),
    source: event.sourceFile ? `${event.sourceFile}:${event.lineNumber}:${event.columnNumber}` : '',
    disposition: event.disposition,
  });
  (window as unknown as {__violations: Violation[]}).__violations = violations;
  listeners.forEach(listener => listener());
});
