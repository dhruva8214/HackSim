import { useState, useEffect, useRef } from 'react';

export default function TerminalLine({ line, animate = false, speed = 15, onComplete }) {
  const [displayed, setDisplayed] = useState(animate ? '' : line.text);
  const [done, setDone] = useState(!animate);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!animate) {
      setDisplayed(line.text);
      setDone(true);
      return;
    }

    indexRef.current = 0;
    setDisplayed('');
    setDone(false);

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current >= line.text.length) {
        setDisplayed(line.text);
        setDone(true);
        clearInterval(interval);
        if (onComplete) onComplete();
      } else {
        setDisplayed(line.text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [line.text, animate, speed]);

  const getColorClass = () => {
    switch (line.type) {
      case 'command': return 'terminal-line-command';
      case 'error': return 'terminal-line-error';
      case 'success': return 'terminal-line-success';
      case 'hint': return 'terminal-line-hint';
      case 'narrative': return 'terminal-line-narrative';
      case 'system': return 'terminal-line-system';
      default: return 'terminal-line-output';
    }
  };

  return (
    <div className={`terminal-line ${getColorClass()}`}>
      {line.type === 'command' && (
        <span className="terminal-prompt">{line.prompt || '$ '}</span>
      )}
      <span className="terminal-text">
        {displayed}
        {animate && !done && <span className="typing-cursor">▊</span>}
      </span>
    </div>
  );
}
