import './violations';

import * as Sentry from '@sentry/react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import {App} from './App';

Sentry.init({
  dsn: 'https://be6c1a7c1f04c2e2a4e030312c94db3e@o546955.ingest.us.sentry.io/4512147092144128',
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
