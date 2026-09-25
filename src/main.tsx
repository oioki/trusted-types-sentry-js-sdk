import './violations';

import * as Sentry from '@sentry/react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {App} from './App';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN ?? 'https://examplePublicKey@o0.ingest.sentry.io/0',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
    Sentry.feedbackIntegration({colorScheme: 'system'}),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
