// AudioManager.js — Web Audio API synthetic sound effects
class AudioManagerClass {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.enabled = false;
  }

  init() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.enabled = true;
    } catch (e) {
      console.warn('Web Audio API not available');
      this.enabled = false;
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (val && !this.audioContext) this.init();
  }

  _playTone(freq, duration, type = 'sine', volume = this.masterVolume) {
    if (!this.enabled || !this.audioContext) return;
    try {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start();
      osc.stop(this.audioContext.currentTime + duration);
    } catch(e) { /* ignore audio errors */ }
  }

  playKeypress() {
    this._playTone(800 + Math.random() * 200, 0.05, 'square', 0.05);
  }

  playCommand() {
    this._playTone(440, 0.08, 'sine', 0.15);
  }

  playSuccess() {
    if (!this.enabled || !this.audioContext) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.2, 'sine', 0.2), i * 100);
    });
  }

  playError() {
    this._playTone(200, 0.3, 'sawtooth', 0.15);
  }

  playHint() {
    this._playTone(660, 0.15, 'triangle', 0.12);
    setTimeout(() => this._playTone(880, 0.15, 'triangle', 0.12), 100);
  }

  playMissionComplete() {
    if (!this.enabled || !this.audioContext) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.3, 'sine', 0.25), i * 150);
    });
  }

  playNarrative() {
    this._playTone(330, 0.2, 'triangle', 0.1);
  }

  playClick() {
    this._playTone(1000, 0.05, 'sine', 0.08);
  }

  playTick() {
    this._playTone(1200, 0.03, 'sine', 0.05);
  }

  playChapterSelect() {
    this._playTone(300, 0.1, 'triangle', 0.05);
    setTimeout(() => this._playTone(450, 0.1, 'triangle', 0.05), 40);
  }
}

export const audioManager = new AudioManagerClass();
