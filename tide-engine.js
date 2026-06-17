/* Vesta — TideCanvas: the living-water engine (the signature of the whole product)
 * One persistent canvas; screens read/write this ONE model, never recreate a line.
 * Renders: drifting water surface (sum of sines) + a high-tide hump, gold luminous
 * line, sun = Vesta (glow + god-rays + core), shimmering reflection bands, sinking
 * light-motes, breathing "now" dot, tap swells + ripple rings. Cool→warm via `warm`.
 *
 * Usage:
 *   const tide = new TideCanvas(canvasEl, { env:'dusk' });
 *   tide.set({ warm:1, crest:24, light:.85 });   // screens set targets; engine lerps
 *   tide.splash(x);                                // tap → swell + ripple + (haptic)
 *   tide.start();                                  // rAF loop (auto-respects Reduce Motion)
 *
 * Performance: 60fps. Cache any static profile (natal positions / week profile) once.
 * In React Native use Skia + a worklet; keep this model in a store across navigation. */
(function (root) {
  'use strict';
  var REDUCE = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches;

  function lerp(a, b, k) { return a + (b - a) * k; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function TideCanvas(canvas, opts) {
    opts = opts || {};
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.DPR = Math.min(window.devicePixelRatio || 1, 2);
    // state (current) + targets (set by screens) — lerped each frame
    this.s = { baseY: 0, amp: .55, crest: 0, peakX: 0, warm: 0, light: 0, layers: 1 };
    this.t = { baseY: 0, amp: .55, crest: 0, peakX: 0, warm: 0, light: 0, layers: 1 };
    this.swells = []; this.ripples = []; this.motes = [];
    this.env = opts.env || 'dusk';
    this._t0 = performance.now(); this._tp = this._t0; this._raf = 0;
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  TideCanvas.prototype.resize = function () {
    var r = this.cv.getBoundingClientRect();
    this.w = r.width; this.h = r.height;
    this.cv.width = Math.max(1, r.width * this.DPR);
    this.cv.height = Math.max(1, r.height * this.DPR);
    this.ctx.setTransform(this.DPR, 0, 0, this.DPR, 0, 0);
    this.cx = this.w * 0.5;
    if (!this.t.baseY) { this.t.baseY = this.s.baseY = this.h * 0.46; }
    if (!this.t.peakX) { this.t.peakX = this.s.peakX = this.w * 0.6; }
    this.motes = [];
    for (var i = 0; i < 24; i++) this.motes.push({
      x: Math.random() * this.w, y: this.h * 0.5 + Math.random() * this.h * 0.5,
      r: .5 + Math.random() * 1.4, sp: 3 + Math.random() * 6, ph: Math.random() * 6
    });
  };

  // screens set targets here: { warm, crest, light, baseY(0..1 of h), peakX(0..1), amp, layers }
  TideCanvas.prototype.set = function (o) {
    if (o.warm != null) this.t.warm = o.warm;
    if (o.crest != null) this.t.crest = o.crest;
    if (o.light != null) this.t.light = o.light;
    if (o.amp != null) this.t.amp = o.amp;
    if (o.layers != null) this.t.layers = o.layers;
    if (o.baseY != null) this.t.baseY = this.h * o.baseY;
    if (o.peakX != null) this.t.peakX = this.w * o.peakX;
    if (o.env) this.env = o.env;
  };

  TideCanvas.prototype.splash = function (x, amp) {
    var t = (performance.now() - this._t0) / 1000;
    x = x == null ? this.s.peakX : x;
    this.swells.push({ x: x, amp: amp || 15, t0: t });
    this.ripples.push({ x: x, t0: t });
    if (navigator.vibrate) navigator.vibrate(13);
  };

  TideCanvas.prototype._surfaceY = function (x, t) {
    var s = this.s, y = s.baseY;
    y += s.amp * (4 * Math.sin(x * 0.018 + t * 1.05) + 2 * Math.sin(x * 0.031 - t * 1.6 + 1.3) + 3 * Math.sin(x * 0.011 + t * 0.6 + 2.1));
    y -= s.crest * Math.exp(-((x - s.peakX) * (x - s.peakX)) / (2 * 70 * 70));
    for (var i = 0; i < this.swells.length; i++) {
      var sw = this.swells[i], d = t - sw.t0, k = Math.exp(-d / 0.5);
      y -= sw.amp * k * Math.exp(-((x - sw.x) * (x - sw.x)) / (2 * 48 * 48));
    }
    return y;
  };

  TideCanvas.prototype._draw = function (t, dt) {
    var ctx = this.ctx, w = this.w, h = this.h, s = this.s, T = this.t;
    // lerp toward targets (smooth, continuous through screen changes)
    s.baseY = lerp(s.baseY, T.baseY, .05); s.amp = lerp(s.amp, T.amp, .06);
    s.crest = lerp(s.crest, T.crest, .06); s.light = lerp(s.light, T.light, .05);
    s.warm = lerp(s.warm, T.warm, .04); s.peakX = lerp(s.peakX, T.peakX, .07);
    s.layers = lerp(s.layers, T.layers, .08);
    var warm = s.warm, light = s.light, cyl = s.baseY - 64;
    ctx.clearRect(0, 0, w, h);

    // sun glow + god-rays + core (only as warm rises) — sun = Vesta
    if (warm > .01) {
      var g = ctx.createRadialGradient(this.cx, cyl, 3, this.cx, cyl, 116);
      g.addColorStop(0, 'rgba(255,244,214,' + (.88 * light * warm) + ')');
      g.addColorStop(.42, 'rgba(245,210,150,' + (.42 * light * warm) + ')');
      g.addColorStop(1, 'rgba(245,210,150,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.cx, cyl, 116, 0, 7); ctx.fill();
      ctx.save(); ctx.translate(this.cx, cyl); ctx.rotate(t * .05); ctx.globalCompositeOperation = 'lighter';
      for (var k = 0; k < 14; k++) {
        var ang = (k / 14) * Math.PI * 2, len = 56 + 20 * Math.sin(t * 1.1 + k),
          ra = .07 * warm * light * (.55 + .45 * Math.sin(t * 1.5 + k * 1.3));
        if (ra <= .004) continue;
        var rg = ctx.createLinearGradient(0, 0, Math.cos(ang) * len, Math.sin(ang) * len);
        rg.addColorStop(0, 'rgba(255,240,205,' + ra.toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,240,205,0)');
        ctx.strokeStyle = rg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len); ctx.stroke();
      }
      ctx.restore();
    }

    // surface points
    var step = 4, pts = [], x;
    for (x = 0; x <= w; x += step) pts.push([x, this._surfaceY(x, t)]);

    // water body (warms with `warm`)
    ctx.beginPath(); ctx.moveTo(0, pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    var bg = ctx.createLinearGradient(0, s.baseY - 16, 0, h);
    bg.addColorStop(0, 'rgba(' + (lerp(120, 128, warm) | 0) + ',' + (lerp(176, 150, warm) | 0) + ',' + (lerp(190, 150, warm) | 0) + ',' + (.18 + .16 * warm) + ')');
    bg.addColorStop(.34, 'rgba(50,68,108,.32)'); bg.addColorStop(.74, 'rgba(20,22,52,.40)'); bg.addColorStop(1, 'rgba(10,9,26,.55)');
    ctx.fillStyle = bg; ctx.fill();

    // warm reflex on the water
    if (warm > .01) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      var wg = ctx.createRadialGradient(this.cx, s.baseY + 8, 4, this.cx, s.baseY + 8, 150);
      wg.addColorStop(0, 'rgba(245,205,140,' + (.14 * light * warm) + ')'); wg.addColorStop(1, 'rgba(245,205,140,0)');
      ctx.fillStyle = wg; ctx.fillRect(0, s.baseY - 20, w, 210); ctx.restore();
    }

    // sinking light-motes (depth)
    for (var m = 0; m < this.motes.length; m++) {
      var mo = this.motes[m]; mo.y += mo.sp * dt; mo.x += Math.sin(t * .6 + mo.ph) * .2;
      if (mo.y > h) { mo.y = s.baseY + 18; mo.x = Math.random() * w; }
      if (mo.y < s.baseY) continue;
      var dp = (mo.y - s.baseY) / (h - s.baseY), a = .3 * (1 - dp) * Math.min(1, light + .4);
      ctx.fillStyle = (warm > .3 ? 'rgba(245,228,190,' : 'rgba(200,222,232,') + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(mo.x, mo.y, mo.r, 0, 7); ctx.fill();
    }

    // gold reflection bands (light on water) — warm only
    if (warm > .02) {
      var rTop = this._surfaceY(this.cx, t);
      for (var by = 3; by < 150; by += 7) {
        var ry = rTop + by, fall = 1 - by / 150, bw = 14 + by * .1, jit = Math.sin(t * 1.8 + by * .25) * 3;
        var a3 = .34 * light * warm * fall * (.5 + .5 * Math.sin(t * 3 + by * .55)); if (a3 <= .01) continue;
        ctx.strokeStyle = 'rgba(245,217,139,' + a3.toFixed(3) + ')'; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(this.cx - bw / 2 + jit, ry); ctx.lineTo(this.cx + bw / 2 + jit, ry); ctx.stroke();
      }
      ctx.lineCap = 'butt';
    }

    // surface line: cool aqua → gold by `warm`
    var lr = lerp(127, 245, warm), lg2 = lerp(183, 217, warm), lb = lerp(196, 139, warm);
    var lgr = ctx.createLinearGradient(0, 0, w, 0);
    lgr.addColorStop(0, 'rgba(127,183,196,.85)');
    lgr.addColorStop(.55, 'rgba(' + (lr | 0) + ',' + (lg2 | 0) + ',' + (lb | 0) + ',.95)');
    lgr.addColorStop(1, 'rgba(' + (lerp(111, 202, warm) | 0) + ',' + (lerp(160, 162, warm) | 0) + ',' + (lerp(173, 74, warm) | 0) + ',.85)');
    ctx.strokeStyle = lgr; ctx.lineWidth = 2.4; ctx.shadowColor = warm > .3 ? 'rgba(245,217,139,.7)' : 'rgba(160,200,210,.5)';
    ctx.shadowBlur = lerp(6, 11, warm); ctx.beginPath();
    for (var j = 0; j < pts.length; j++) (j === 0 ? ctx.moveTo(pts[j][0], pts[j][1]) : ctx.lineTo(pts[j][0], pts[j][1]));
    ctx.stroke(); ctx.shadowBlur = 0;

    // travelling specular glint (warm)
    if (warm > .2) {
      var gx = ((t * .1) % 1) * w; ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(255,250,235,' + (.9 * warm) + ')'; ctx.lineWidth = 3; ctx.shadowColor = 'rgba(255,246,222,.9)'; ctx.shadowBlur = 12; ctx.beginPath();
      for (var gg = gx - 16; gg <= gx + 16; gg += 4) { if (gg < 0) continue; var yy = this._surfaceY(gg, t); (gg <= gx - 12 ? ctx.moveTo(gg, yy) : ctx.lineTo(gg, yy)); }
      ctx.globalAlpha = .8; ctx.stroke(); ctx.globalAlpha = 1; ctx.restore(); ctx.shadowBlur = 0;
    }

    // light core + breathing "now" dot
    var cyTop = this._surfaceY(this.cx, t);
    if (warm > .02) {
      var core = ctx.createRadialGradient(this.cx, cyl, 0, this.cx, cyl, 7 + 1.8 * light);
      core.addColorStop(0, 'rgba(255,253,246,' + warm + ')'); core.addColorStop(.5, 'rgba(255,240,204,' + warm + ')'); core.addColorStop(1, 'rgba(245,210,150,0)');
      ctx.fillStyle = core; ctx.beginPath(); ctx.arc(this.cx, cyl, 7 + 1.8 * light, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,246,222,' + (.7 * light * warm) + ')'; ctx.beginPath(); ctx.arc(this.cx, cyTop, 2.4, 0, 7); ctx.fill();
    }

    // tap ripple rings
    for (var r = 0; r < this.ripples.length; r++) {
      var rp = this.ripples[r], age = t - rp.t0, rad = age * 120, ar = Math.max(0, .48 - age * .58); if (ar <= 0) continue;
      ctx.strokeStyle = (warm > .3 ? 'rgba(245,217,139,' : 'rgba(160,200,210,') + ar + ')'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.ellipse(rp.x, this._surfaceY(rp.x, t), rad, rad * .3, 0, 0, 7); ctx.stroke();
    }
    this.swells = this.swells.filter(function (x) { return t - x.t0 < 1.4; });
    this.ripples = this.ripples.filter(function (x) { return t - x.t0 < 1.1; });
  };

  TideCanvas.prototype.start = function () {
    var self = this;
    if (REDUCE) { // freeze to one composed frame
      self.s = Object.assign({}, self.t); self._draw(2, 0); return;
    }
    (function loop(now) {
      var t = (now - self._t0) / 1000, dt = Math.min(.05, (now - self._tp) / 1000); self._tp = now;
      self._draw(t, dt); self._raf = requestAnimationFrame(loop);
    })(performance.now());
  };
  TideCanvas.prototype.stop = function () { cancelAnimationFrame(this._raf); };

  if (typeof module !== 'undefined' && module.exports) module.exports = TideCanvas;
  else root.TideCanvas = TideCanvas;
})(typeof window !== 'undefined' ? window : this);
