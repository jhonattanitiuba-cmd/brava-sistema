// ═══════════════════════════════════════════════════════════════
// BOLA DE NEVE · som de catraca (Web Audio, sintetizado)
// Acompanha o contador do painel: cliques secos com a taxa em
// crescendo ate 100% da contagem. Sem arquivo de audio externo.
// window.BNRatchet.play(durationMs, onTick) e window.BNRatchet.toggleMute()
// ═══════════════════════════════════════════════════════════════

window.BNRatchet = (function () {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Um clique curto: ruido percussivo com envelope bem rapido (catraca).
  function tick(gainValue) {
    const ac = ensure();
    if (!ac || muted) return;
    const now = ac.currentTime;

    // corpo do clique = oscilador agudo + queda instantanea
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2100 + Math.random() * 400, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.012);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gainValue, now + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);
    osc.connect(g).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  // Toca a catraca ao longo de durationMs. A cadencia acelera (crescendo)
  // simulando a roda girando cada vez mais rapido ate travar no final.
  function play(durationMs, onTick) {
    const total = Math.max(220, durationMs || 1200);
    const start = performance.now();
    let raf = null;
    let nextAt = 0;

    function frame(t) {
      const p = Math.min(1, (t - start) / total);
      // easing: comeca lento, acelera; intervalo entre cliques cai de ~90ms para ~26ms
      const interval = 90 - 64 * p;
      if (t >= nextAt) {
        tick(0.05 + 0.09 * p);
        if (typeof onTick === 'function') onTick(p);
        nextAt = t + interval;
      }
      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        // batida final mais seca (a catraca travando)
        tick(0.16);
      }
    }
    raf = requestAnimationFrame(frame);
    return () => raf && cancelAnimationFrame(raf);
  }

  function toggleMute() { muted = !muted; return muted; }
  function isMuted() { return muted; }
  function setMuted(v) { muted = !!v; }

  return { play, tick, toggleMute, isMuted, setMuted };
})();
