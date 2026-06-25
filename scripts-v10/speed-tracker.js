/* [fork] Tracker de pasos — footstep speed matcher.
   - "Escuchar referencia": loops a synthesized footstep at Lento/Normal/Rápido so you can
     compare to what you hear in-game (uses the game's own speed→BPM curve for cadence).
   - "Tap": tap along with the ghost's footsteps → computes m/s → speed band → applies the
     speed filter to narrow the candidates.
   100% local (Web Audio synth, no sound files). Reuses speedToBpm/bpmToSpeed from metronome. */
(function () {
    var ctx = null;
    function ac() {
        if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; } }
        if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
        return ctx;
    }
    // synthesized footstep: low thump + a short noise "scuff"
    function thud() {
        var a = ac(); if (!a) return;
        var t = a.currentTime;
        var o = a.createOscillator(), g = a.createGain();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(48, t + 0.08);
        g.gain.setValueAtTime(0.55, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
        o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.14);
        var len = Math.floor(a.sampleRate * 0.03);
        var buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
        var n = a.createBufferSource(); n.buffer = buf;
        var ng = a.createGain(); ng.gain.value = 0.22;
        n.connect(ng).connect(a.destination); n.start(t);
    }

    // m/s → ms between footsteps, using the game's speed→BPM curve (idx 2 = 100% ghost speed)
    function msToInterval(ms) {
        try {
            var bpm = speedToBpm[2](ms, false, 0, false);
            if (bpm > 0 && isFinite(bpm)) return 60000 / bpm;
        } catch (e) {}
        return 60000 / (ms * 68);
    }
    function bandOf(ms) { return ms < 1.6 ? 'Slow' : ms > 1.85 ? 'Fast' : 'Normal'; }
    function bandEs(b) { return b === 'Slow' ? 'Lento' : b === 'Fast' ? 'Rápido' : 'Normal'; }

    // ---- footstep loop (used by the panel references AND per-card play buttons) ----
    var loopTimer = null, loopMs = null, loopBtn = null;
    function stopLoop() {
        if (loopTimer) { clearInterval(loopTimer); loopTimer = null; }
        loopMs = null; loopBtn = null;
        var btns = document.querySelectorAll('#speed_tracker .st-ref.active, .g2-steps.active');
        for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    }
    function playRef(ms, btn) {
        // clicking the same button again stops it
        if (loopBtn === (btn || null) && loopMs === ms) { stopLoop(); return; }
        stopLoop();
        loopMs = ms; loopBtn = btn || null;
        if (btn) btn.classList.add('active');
        thud();
        loopTimer = setInterval(thud, msToInterval(ms));
    }

    // ---- tap tempo ----
    var taps = [];
    var lastMs = null, lastBand = null;
    function tap() {
        thud();
        var now = (window.performance ? performance.now() : Date.now());
        if (taps.length && now - taps[taps.length - 1] > 2500) taps = [];
        taps.push(now);
        if (taps.length > 8) taps = taps.slice(-8);
        var out = document.getElementById('st-tap-result');
        if (!out) return;
        if (taps.length >= 3) {
            var sum = 0;
            for (var i = 1; i < taps.length; i++) sum += taps[i] - taps[i - 1];
            var avg = sum / (taps.length - 1);
            var bpm = 60000 / avg;
            var ms;
            try { ms = bpmToSpeed[2](bpm, false, 0, false); } catch (e) { ms = bpm / 70; }
            lastMs = ms; lastBand = bandOf(ms);
            var num = (Math.round(ms * 100) / 100).toFixed(2).replace('.', ',');
            out.innerHTML = '<b>' + num + ' m/s</b> &middot; <span class="st-band st-' + lastBand.toLowerCase() + '">' + bandEs(lastBand) + '</span>';
            out.classList.add('st-have');
        } else {
            out.textContent = 'Sigue tocando… (' + taps.length + '/3)';
        }
    }
    function resetTap() {
        taps = []; lastMs = null; lastBand = null;
        var out = document.getElementById('st-tap-result');
        if (out) { out.textContent = 'Toca un botón por cada paso que oigas'; out.classList.remove('st-have'); }
    }
    function applyBand() {
        if (!lastBand) return;
        var btn = document.getElementById(lastBand); // Slow / Normal / Fast filter buttons
        if (!btn) return;
        var cb = btn.querySelector('#checkbox');
        if (cb && cb.classList.contains('neutral')) btn.click();
    }

    function toggle() {
        var p = document.getElementById('speed_tracker');
        var b = document.getElementById('speed_tracker_btn');
        if (!p) return;
        var open = p.classList.toggle('st-open');
        if (b) b.classList.toggle('active', open);
        if (!open) stopLoop();
    }

    window.stPlayRef = playRef;
    window.stStopRef = stopLoop;
    window.stTap = tap;
    window.stResetTap = resetTap;
    window.stApplyBand = applyBand;
    window.toggleSpeedTracker = toggle;
})();
