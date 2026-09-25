# trusted-types-sentry-js-sdk

A minimal Vite + React app with `@sentry/react` and a
`require-trusted-types-for 'script'` CSP. The app defines no Trusted Types
policies of its own, so every violation it shows comes from the Sentry
JavaScript SDK.

## Run

```sh
npm install
npm run build
npm run preview            # CSP in report-only mode
npm run preview:enforce    # CSP enforced
```

Open http://localhost:4173/ and use the buttons. Violations are listed on the
page as they happen. `VITE_SENTRY_DSN` sets a real DSN at build time; the
default is a placeholder.

`npm run check` and `npm run check:enforce` do the same in headless Chrome and
print the results. Set `CHROME_PATH` if Chrome is not in `/Applications`.

## Results (`@sentry/react` 11.0.0, Chrome)

| Sink | Trigger | When enforced | Workaround |
| --- | --- | --- | --- |
| `new Worker(blob:)` | Replay compression worker, on page load | SDK catches the error | `replayIntegration({useCompression: false})` |
| `Element.innerHTML` | Feedback form (Sentry logo) | Form doesn't render | `feedbackIntegration({showBranding: false})` |
| `HTMLScriptElement.src` | `showReportDialog()` | Throws, so no dialog | None |
| `HTMLScriptElement.src` | `lazyLoadIntegration()` | Throws, so the integration doesn't load | None |

With both workarounds applied, the two `script.src` sinks remain. The only way
around them is a pass-through `default` policy, which defeats the point of
Trusted Types.
