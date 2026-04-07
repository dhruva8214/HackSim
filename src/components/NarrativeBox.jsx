import { useState, useEffect } from 'react';

export default function NarrativeBox({ text, onDismiss }) {
  const [displayed, setDisplayed] = useState('');
  const [showFull, setShowFull] = useState(false);

  useEffect(() => {
    if (!text) return;
    setDisplayed('');
    setShowFull(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= text.length) {
        setDisplayed(text);
        setShowFull(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  const handleSkip = () => {
    setDisplayed(text);
    setShowFull(true);
  };

  if (!text) return null;

  return (
    <div className="narrative-overlay" onClick={showFull ? undefined : handleSkip}>
      <div className="narrative-box">
        <div className="narrative-header">
          <span className="narrative-secure-icon">🔒</span>
          <span>SECURE TRANSMISSION</span>
          <span className="narrative-blink">●</span>
        </div>
        <div className="narrative-body">
          <pre className="narrative-text">{displayed}{!showFull && <span className="typing-cursor">▊</span>}</pre>
        </div>
        <div className="narrative-footer">
          {showFull ? (
            <button className="narrative-btn" onClick={onDismiss}>
              [ ACKNOWLEDGE — Press ESC or Click ]
            </button>
          ) : (
            <button className="narrative-btn" onClick={handleSkip}>
              [ SKIP — Click to reveal ]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
