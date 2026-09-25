import * as Sentry from '@sentry/react';
import {useEffect, useState, useSyncExternalStore} from 'react';

import {subscribe, violations} from './violations';

function useCspMode() {
  const [mode, setMode] = useState('');
  useEffect(() => {
    fetch(location.href, {method: 'HEAD'}).then(response =>
      setMode(response.headers.has('content-security-policy') ? 'enforced' : 'report-only')
    );
  }, []);
  return mode;
}

function useViolations() {
  return useSyncExternalStore(subscribe, () => violations.length);
}

async function openFeedback() {
  const feedback = Sentry.getFeedback();
  const form = await feedback?.createForm();
  form?.appendToDom();
  form?.open();
}

function showReportDialog() {
  const eventId = Sentry.captureMessage('Trusted Types demo');
  Sentry.showReportDialog({eventId});
}

async function lazyLoadIntegration() {
  const integration = await Sentry.lazyLoadIntegration('replayCanvasIntegration');
  Sentry.addIntegration(integration());
}

export function App() {
  useViolations();
  const mode = useCspMode();

  return (
    <main>
      <h1>Trusted Types vs. the Sentry JS SDK</h1>
      <p>
        This page is served with <code>require-trusted-types-for 'script'</code> and
        defines no Trusted Types policies of its own. Every violation below comes from
        <code>@sentry/react</code>.
      </p>

      <div className="actions">
        <button id="feedback" onClick={openFeedback}>
          Open feedback form
        </button>
        <button id="report-dialog" onClick={showReportDialog}>
          showReportDialog()
        </button>
        <button id="lazy-load" onClick={lazyLoadIntegration}>
          lazyLoadIntegration()
        </button>
        <button id="error" onClick={() => Sentry.captureException(new Error('demo'))}>
          Capture error
        </button>
      </div>

      <h2>
        {violations.length} violation{violations.length === 1 ? '' : 's'}{' '}
        <small>{mode}</small>
      </h2>
      <table>
        <thead>
          <tr>
            <th>Sink</th>
            <th>Sample</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {violations.map((violation, i) => (
            <tr key={i}>
              <td>{violation.sink}</td>
              <td>
                <code>{violation.sample}</code>
              </td>
              <td>{violation.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
