import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const phases = [
  {
    className: 'title-phase title-phase--long',
    content: (
      <>
        simplest spec<span className="title-hyphen">-</span>driven development
      </>
    ),
  },
  {
    className: 'title-phase title-phase--short',
    content: 'ssdd',
  },
  {
    className: 'title-phase title-phase--short title-phase--math',
    content: (
      <>
        s<span className="title-exponent">2</span>d
        <span className="title-exponent">2</span>
      </>
    ),
  },
  {
      className: 'title-phase title-phase--short title-phase--math title-phase--final',
      content: (
        <>
          <span className="title-exponent title-exponent--spacer">2</span>
          (sd)<span className="title-exponent">2</span>
        </>
      ),
  },
];

const usageOptions = [
  { id: 'install', action: 'init', command: 'npx simplest-sdd@latest init' },
  { id: 'update', action: 'update', command: 'npx simplest-sdd@latest update' },
  { id: 'remove', action: 'remove', command: 'npx simplest-sdd@latest remove' },
];

async function sendToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

function App() {
  const [fontReady, setFontReady] = useState(false);
  const [selectedAction, setSelectedAction] = useState('install');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const confirmationTimer = useRef(null);
  const captureFinal = new URLSearchParams(window.location.search).get('capture') === 'final';
  const selectedOption = usageOptions.find(({ id }) => id === selectedAction);

  useEffect(() => {
    let active = true;

    if (!document.fonts?.ready) {
      setFontReady(true);
      return undefined;
    }

    document.fonts.ready.then(() => {
      if (active) setFontReady(true);
    });

    return () => {
      active = false;
      window.clearTimeout(confirmationTimer.current);
    };
  }, []);

  async function handleCommandButton() {
    try {
      await sendToClipboard(`Run ${selectedOption.command} and follow the instructions`);
      window.clearTimeout(confirmationTimer.current);
      setIsConfirmed(true);
      confirmationTimer.current = window.setTimeout(() => setIsConfirmed(false), 1600);
    } catch {
      setIsConfirmed(false);
    }
  }

  return (
    <main className={`landing ${captureFinal ? 'landing--capture' : ''}`}>
      <section className="hero" aria-label="Simplest spec-driven development">
        <h1
          className={`wordmark ${fontReady ? 'wordmark--ready' : ''}`}
          aria-label="Simplest spec-driven development. S S D D. S squared D squared. Open parenthesis S D close parenthesis squared."
        >
          {phases.map((phase, index) => (
            <span
              aria-hidden="true"
              className={phase.className}
              key={index}
              style={{ '--phase-delay': `${index * 3}s` }}
            >
              {phase.content}
            </span>
          ))}
        </h1>
      </section>

      {!captureFinal && (
        <section className="usage" aria-label="Usage">
          <div className="usage-options" aria-label="Choose an action">
            {usageOptions.map(({ id }) => (
              <button
                aria-pressed={selectedAction === id}
                className="usage-option"
                key={id}
                onClick={() => {
                  setSelectedAction(id);
                  setIsConfirmed(false);
                }}
                type="button"
              >
                {id}
              </button>
            ))}
          </div>

          <div className="usage-message">
            <p className="usage-lead">
              Tell this to your agent:
            </p>
            <p className="usage-instruction">
              Run npx simplest-sdd@latest{' '}
              <span className="command-action" key={selectedOption.id}>
                {selectedOption.action}
              </span>{' '}
              and follow the instructions
              <button
                aria-label="Copy instruction to clipboard"
                className={`command-button ${isConfirmed ? 'command-button--confirmed' : ''}`}
                onClick={handleCommandButton}
                type="button"
              >
                <span aria-hidden="true" className="command-icon">
                  <span className="command-icon-square command-icon-square--back" />
                  <span className="command-icon-square command-icon-square--front" />
                  <svg
                    className="command-icon-check"
                    focusable="false"
                    viewBox="0 0 12 12"
                  >
                    <path
                      className="command-icon-check-path"
                      d="M2.25 6.15 4.85 8.65 9.85 3.7"
                      pathLength="1"
                    />
                  </svg>
                </span>
              </button>
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
