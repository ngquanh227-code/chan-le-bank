/**
 * Module: Audio Engine
 * Web Audio API synthesizer for sound effects (UI clicks, victory chime, scan beep)
 */
(function() {
  'use strict';
  window.CLB = window.CLB || {};

  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08) {
    if (window.CLB.config && !window.CLB.config.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  function playChime(isWin) {
    if (isWin) {
      playTone(523.25, 'triangle', 0.15); // C5
      setTimeout(() => playTone(659.25, 'triangle', 0.15), 100); // E5
      setTimeout(() => playTone(783.99, 'sine', 0.3), 200); // G5
    } else {
      playTone(330, 'sawtooth', 0.2);
    }
  }

  let mbNotificationAudio = null;
  let lastAudioPlayTime = 0;

  function initMbBankAudio() {
    if (!mbNotificationAudio) {
      try {
        mbNotificationAudio = new Audio('audio/mbbank_notification.mp3');
        mbNotificationAudio.preload = 'auto';
      } catch (e) {
        console.warn('Cannot init MBBank audio', e);
      }
    }
  }

  function playMbBankAudio() {
    if (window.CLB.config && window.CLB.config.soundEnabled === false) return;
    const now = Date.now();
    if (now - lastAudioPlayTime < 350) return; // Prevent double-trigger overlap
    lastAudioPlayTime = now;

    try {
      initAudio();
      initMbBankAudio();
      if (!mbNotificationAudio) return;
      mbNotificationAudio.currentTime = 0;
      const playPromise = mbNotificationAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          // Autoplay policy prevented playback until user interaction
          console.debug('MBBank notification audio play deferred:', err);
        });
      }
    } catch (e) {
      // Audio error catch
    }
  }

  // Pre-unlock audio on first user gesture anywhere
  const unlockAudio = () => {
    initAudio();
    initMbBankAudio();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { passive: true });
  document.addEventListener('touchstart', unlockAudio, { passive: true });
  document.addEventListener('keydown', unlockAudio, { passive: true });

  window.CLB.audio = {
    initAudio,
    playTone,
    playChime,
    playMbBankAudio
  };
})();
