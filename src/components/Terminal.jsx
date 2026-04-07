import { useState, useRef, useEffect, useCallback } from 'react';
import TerminalLine from './TerminalLine';
import { audioManager } from './AudioManager';

export default function Terminal({ 
  history, 
  prompt, 
  onCommand, 
  disabled = false,
  typingAnimation = true 
}) {
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  // Focus input on click
  const focusInput = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Focus on mount
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = input.trim();
      if (cmd) {
        setCommandHistory(prev => [...prev, cmd].slice(-50));
        setHistoryIndex(-1);
        audioManager.playCommand();
        onCommand(cmd);
      }
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic command autocomplete
      const commands = ['ls', 'cd', 'cat', 'grep', 'decode', 'crack', 'analyze', 'exploit', 'help', 'hint', 'clear', 'pwd', 'status'];
      const matches = commands.filter(c => c.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0] + ' ');
      } else if (matches.length > 1) {
        // Show available completions
        onCommand(`help`);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      onCommand('clear');
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    audioManager.playKeypress();
  };

  return (
    <div className="terminal-container" onClick={focusInput}>
      <div className="terminal-output" ref={outputRef} role="log" aria-live="polite" aria-label="Terminal output">
        {history.map((line, i) => (
          <TerminalLine
            key={i}
            line={line}
            animate={typingAnimation && i === history.length - 1 && line.type === 'narrative'}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="terminal-input-area">
        <span className="terminal-prompt">{prompt}</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Terminal command input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
}
