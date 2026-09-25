import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

const enforce = process.env.TT_MODE === 'enforce';

const csp = "require-trusted-types-for 'script'";

export default defineConfig({
  plugins: [react()],
  preview: {
    headers: {
      [enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only']: csp,
    },
  },
});
