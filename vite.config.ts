import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

const enforce = process.env.TT_MODE === 'enforce';

const reportUri =
  'https://o546955.ingest.us.sentry.io/api/4512147092144128/security/?sentry_key=be6c1a7c1f04c2e2a4e030312c94db3e';

const csp = `require-trusted-types-for 'script'; report-uri ${reportUri}`;

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: {
      [enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only']: csp,
    },
  },
});
