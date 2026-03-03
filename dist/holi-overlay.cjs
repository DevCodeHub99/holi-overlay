/**
 * 🎨 Holi Overlay v1.0.0 — UMD Build
 * Festive celebration effect for any website.
 * @license MIT
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.HoliOverlay = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

/**
 * 🎨 Holi Overlay — Festive celebration effect for any website
 *
 * A stunning, framework-agnostic Holi festival overlay featuring:
 * - Colorful water balloons that burst on impact
 * - Pichkaari (water gun) streams shooting across the screen
 * - Ambient gradient color corners with breathing animations
 * - Splash particles with realistic physics
 *
 * @version 1.0.0
 * @license MIT
 */

// ─────────────────────────────────────────────
// Default festive color palette
// ─────────────────────────────────────────────
const DEFAULT_COLORS = [
    { r: 255, g: 105, b: 180 }, // Pink
    { r: 255, g: 223, b: 0 },   // Yellow
    { r: 50, g: 205, b: 50 },   // Green
    { r: 0, g: 191, b: 255 },   // Blue
    { r: 255, g: 140, b: 0 },   // Orange
    { r: 148, g: 0, b: 211 },   // Violet
    { r: 0, g: 255, b: 255 },   // Cyan
    { r: 255, g: 20, b: 147 },  // DeepPink
    { r: 173, g: 255, b: 47 }   // GreenYellow
];

// ─────────────────────────────────────────────
// Constants & Utilities
// ─────────────────────────────────────────────

// Max particles per Pichkaari to prevent runaway memory usage
const MAX_PICHKAARI_PARTICLES = 600;
// Max total splashes alive at once
const MAX_SPLASHES = 30;

/**
 * In-place array filter — avoids GC pressure in hot render loop.
 * Mutates the array instead of creating a new one.
 */
function filterInPlace(arr, predicate) {
    let writeIdx = 0;
    for (let readIdx = 0; readIdx < arr.length; readIdx++) {
        if (predicate(arr[readIdx])) {
            arr[writeIdx++] = arr[readIdx];
        }
    }
    arr.length = writeIdx;
}

// ─────────────────────────────────────────────
// Particle
// ─────────────────────────────────────────────
class Particle {
    constructor(x, y, color, isPowder, vx, vy, gravity = 0.4) {
        this.x = x;
        this.y = y;
        this.isPowder = isPowder;
        this.gravity = gravity;
        this.color = color;
        this.life = 0;

        if (isPowder) {
            this.vx = vx ?? (Math.random() - 0.5) * 16;
            this.vy = vy ?? (Math.random() - 0.5) * 16;
            this.maxLife = Math.random() * 45 + 30;
            this.size = Math.random() * 10 + 4;
        } else {
            this.vx = vx ?? (Math.random() - 0.5) * 12;
            this.vy = vy ?? (Math.random() - 0.5) * 12;
            this.maxLife = Math.random() * 20 + 20;
            this.size = Math.random() * 5 + 2;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.isPowder) {
            this.vx *= 0.88;
            this.vy *= 0.88;
            this.size *= 0.98;
        } else {
            this.vy += this.gravity;
        }

        this.life++;
    }

    draw(ctx) {
        const fadeOut = Math.max(0, 1 - this.life / this.maxLife);
        const alpha = fadeOut * (this.isPowder ? 0.35 : 0.9);
        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${alpha})`;

        if (!this.isPowder) {
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const stretch = Math.max(1, speed / 4);
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.atan2(this.vy, this.vx));
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * stretch, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ─────────────────────────────────────────────
// Splash
// ─────────────────────────────────────────────
class Splash {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.life = 0;
        this.maxLife = 160;
        this.size = size * 2.8;
        this.particles = [];

        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color, false));
        }
        for (let i = 0; i < 35; i++) {
            this.particles.push(new Particle(x, y, color, true));
        }
    }

    update() {
        this.life++;
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
        }
        filterInPlace(this.particles, (p) => p.life < p.maxLife);
    }

    draw(ctx) {
        let alpha = 0.35;
        if (this.life > this.maxLife * 0.6) {
            alpha = Math.max(0, 1 - ((this.life - this.maxLife * 0.6) / (this.maxLife * 0.4))) * 0.35;
        }

        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${this.color.r},${this.color.g},${this.color.b},${alpha})`);
        grad.addColorStop(0.5, `rgba(${this.color.r},${this.color.g},${this.color.b},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${this.color.r},${this.color.g},${this.color.b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.size);
        ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(ctx);
        }
    }
}

// ─────────────────────────────────────────────
// Balloon
// ─────────────────────────────────────────────
class Balloon {
    constructor(canvasWidth, canvasHeight, colors) {
        this.active = true;
        this.radius = Math.random() * 25 + 10;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.burstLife = Math.random() * 30 + 15;
        this.life = 0;
        this.gravity = 0.15;

        const side = Math.floor(Math.random() * 4);
        if (side === 0) {
            this.x = Math.random() * canvasWidth;
            this.y = -50;
            this.vx = (Math.random() - 0.5) * 6;
            this.vy = Math.random() * 8 + 6;
        } else if (side === 1) {
            this.x = -50;
            this.y = Math.random() * (canvasHeight * 0.8);
            this.vx = Math.random() * 12 + 8;
            this.vy = (Math.random() - 0.5) * 8;
        } else if (side === 2) {
            this.x = canvasWidth + 50;
            this.y = Math.random() * (canvasHeight * 0.8);
            this.vx = -(Math.random() * 12 + 8);
            this.vy = (Math.random() - 0.5) * 8;
        } else {
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + 50;
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = -(Math.random() * 14 + 10);
        }
    }

    update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life++;

        const isInsideScreen = this.x > 0 && this.x < canvasWidth && this.y > 0 && this.y < canvasHeight;

        if ((this.life >= this.burstLife && isInsideScreen) ||
            this.y + this.radius >= canvasHeight ||
            (this.vx > 0 && this.x + this.radius >= canvasWidth) ||
            (this.vx < 0 && this.x - this.radius <= 0)) {

            this.active = false;
            const splashX = Math.min(canvasWidth - 15, Math.max(15, this.x));
            const splashY = Math.min(canvasHeight - 15, Math.max(15, this.y));
            return new Splash(splashX, splashY, this.color, this.radius);
        }

        if (this.y > canvasHeight + 200 || this.x < -200 || this.x > canvasWidth + 200) {
            this.active = false;
        }
        return null;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const stretch = Math.max(1, speed / 8);

        const grad = ctx.createRadialGradient(this.radius * 0.2, -this.radius * 0.2, 0, 0, 0, this.radius * stretch);
        grad.addColorStop(0, `rgba(${this.color.r},${this.color.g},${this.color.b},0.95)`);
        grad.addColorStop(1, `rgba(${this.color.r},${this.color.g},${this.color.b},0.75)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * stretch, this.radius * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},1)`;
        ctx.beginPath();
        ctx.moveTo(-this.radius * stretch - 2, 0);
        ctx.lineTo(-this.radius * stretch - 8, -4);
        ctx.lineTo(-this.radius * stretch - 8, 4);
        ctx.fill();

        ctx.restore();
    }
}

// ─────────────────────────────────────────────
// Pichkaari (Water Gun Stream)
// ─────────────────────────────────────────────
class Pichkaari {
    constructor(canvasWidth, canvasHeight, colors) {
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = 0;
        this.maxLife = Math.random() * 80 + 50;
        this.particles = [];
        this.active = true;

        const side = Math.floor(Math.random() * 3);
        if (side === 0) {
            this.x = -10;
            this.y = Math.random() * (canvasHeight * 0.4) + canvasHeight * 0.3;
            this.vx = Math.random() * 30 + 20;
            this.vy = -(Math.random() * 10 + 5);
        } else if (side === 1) {
            this.x = canvasWidth + 10;
            this.y = Math.random() * (canvasHeight * 0.4) + canvasHeight * 0.3;
            this.vx = -(Math.random() * 30 + 20);
            this.vy = -(Math.random() * 10 + 5);
        } else {
            this.x = Math.random() * (canvasWidth * 0.6) + canvasWidth * 0.2;
            this.y = canvasHeight + 10;
            this.vx = (Math.random() - 0.5) * 20;
            this.vy = -(Math.random() * 35 + 25);
        }
    }

    update() {
        this.life++;
        if (this.life < this.maxLife && this.particles.length < MAX_PICHKAARI_PARTICLES) {
            for (let i = 0; i < 15; i++) {
                if (this.particles.length >= MAX_PICHKAARI_PARTICLES) break;
                const pVx = this.vx + (Math.random() - 0.5) * 5;
                const pVy = this.vy + (Math.random() - 0.5) * 5;
                const particle = new Particle(this.x, this.y, this.color, false, pVx, pVy, 0.4);
                particle.maxLife = Math.random() * 80 + 60;
                particle.size = Math.random() * 6 + 4;
                this.particles.push(particle);
            }

            if (this.vx > 0) { this.vy -= 0.6; this.vx *= 0.98; }
            else if (this.vx < 0) { this.vy -= 0.6; this.vx *= 0.98; }
            else { this.vx += (Math.random() - 0.5) * 4; }
        }

        if (this.life >= this.maxLife && this.particles.length === 0) {
            this.active = false;
        }
        for (let j = 0; j < this.particles.length; j++) {
            this.particles[j].update();
        }
        filterInPlace(this.particles, (p) => p.life < p.maxLife);
    }

    draw(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].draw(ctx);
        }
    }
}

// ─────────────────────────────────────────────
// AmbientCorner
// ─────────────────────────────────────────────
class AmbientCorner {
    constructor(x, y, canvasWidth, canvasHeight, colors) {
        this.x = x;
        this.y = y;
        this.baseRadius = Math.max(canvasWidth, canvasHeight) * 0.35;
        this.timeOffset = Math.random() * 10000;

        const pool = colors.slice().sort(() => 0.5 - Math.random());
        this.color1 = pool[0];
        this.color2 = pool[1] || pool[0];
        this.color3 = pool[2] || pool[0];
    }

    draw(ctx, elapsed) {
        const time = elapsed + this.timeOffset;

        const pulse1 = Math.sin(time * 0.001) * 0.15 + 0.85;
        const pulse2 = Math.cos(time * 0.0013) * 0.15 + 0.85;

        const r1 = this.baseRadius * pulse1;
        const r2 = this.baseRadius * pulse2 * 0.6;

        ctx.save();

        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r1);
        grad.addColorStop(0, `rgba(${this.color1.r},${this.color1.g},${this.color1.b},0.5)`);
        grad.addColorStop(0.5, `rgba(${this.color2.r},${this.color2.g},${this.color2.b},0.2)`);
        grad.addColorStop(1, `rgba(${this.color1.r},${this.color1.g},${this.color1.b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r1, 0, Math.PI * 2);
        ctx.fill();

        const grad2 = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r2);
        grad2.addColorStop(0, `rgba(${this.color3.r},${this.color3.g},${this.color3.b},0.6)`);
        grad2.addColorStop(1, `rgba(${this.color3.r},${this.color3.g},${this.color3.b},0)`);

        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// ─────────────────────────────────────────────
// HoliOverlayController
// ─────────────────────────────────────────────

let _instance = null;
let _instanceCounter = 0;

/**
 * Controller class that manages a single overlay instance.
 * Use HoliOverlay.start() for the simple API or HoliOverlay.create() for advanced use.
 */
class HoliOverlayController {
    /**
     * @param {Object} [options]
     * @param {number} [options.zIndex=99999]
     * @param {number} [options.opacity=0.95]
     * @param {number} [options.maxBalloons=15]
     * @param {number} [options.maxPichkaaris=4]
     * @param {Array<{r:number,g:number,b:number}>} [options.colors]
     * @param {number} [options.duration=0]
     * @param {string} [options.container]
     */
    constructor(options = {}) {
        this._id = ++_instanceCounter;
        this.zIndex = options.zIndex ?? 99999;
        this.opacity = options.opacity ?? 0.95;
        this.maxBalloons = options.maxBalloons ?? 15;
        this.maxPichkaaris = options.maxPichkaaris ?? 4;
        this.colors = options.colors || DEFAULT_COLORS;
        this.duration = options.duration ?? 0;
        this.containerSelector = options.container || null;

        this._canvas = null;
        this._ctx = null;
        this._animationId = null;
        this._running = false;
        this._startTime = 0;
        this._resizeHandler = null;
        this._resizeTimer = null;

        // State
        this._balloons = [];
        this._splashes = [];
        this._pichkaaris = [];
        this._ambientCorners = [];
        this._firstFrame = true;
        this._lastDropTime = 0;
        this._nextDropDelay = Math.random() * 300 + 100;
        this._lastPichkaariTime = 0;
        this._nextPichkaariDelay = Math.random() * 2000 + 1000;
        this._width = 0;
        this._height = 0;
    }

    _getContainer() {
        if (this.containerSelector) {
            return document.querySelector(this.containerSelector) || document.body;
        }
        return document.body;
    }

    _createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = `holi-overlay-canvas-${this._id}`;
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = [
            'position:fixed',
            'top:0',
            'left:0',
            'width:100%',
            'height:100%',
            'pointer-events:none',
            `z-index:${this.zIndex}`,
            `opacity:${this.opacity}`
        ].join(';');

        this._getContainer().appendChild(canvas);
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
    }

    _setSize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;
        this._canvas.width = this._width;
        this._canvas.height = this._height;

        this._ambientCorners = [
            new AmbientCorner(0, 0, this._width, this._height, this.colors),
            new AmbientCorner(this._width, 0, this._width, this._height, this.colors),
            new AmbientCorner(0, this._height, this._width, this._height, this.colors),
            new AmbientCorner(this._width, this._height, this._width, this._height, this.colors)
        ];
    }

    _render(time) {
        if (!this._running) return;

        const ctx = this._ctx;
        const w = this._width;
        const h = this._height;

        // Initialize timing on first frame so spawners don't burst-fire
        if (this._firstFrame) {
            this._firstFrame = false;
            this._startTime = time;
            this._lastDropTime = time;
            this._lastPichkaariTime = time;
        }

        // Auto-stop after duration
        if (this.duration > 0 && time - this._startTime > this.duration) {
            this.stop();
            return;
        }

        ctx.clearRect(0, 0, w, h);

        // Ambient corners
        for (let c = 0; c < this._ambientCorners.length; c++) {
            this._ambientCorners[c].draw(ctx, time);
        }

        // Spawn balloons
        if (time - this._lastDropTime > this._nextDropDelay) {
            if (this._balloons.length < this.maxBalloons) {
                this._balloons.push(new Balloon(w, h, this.colors));
                if (Math.random() > 0.6) {
                    this._balloons.push(new Balloon(w, h, this.colors));
                }
            }
            this._lastDropTime = time;
            this._nextDropDelay = Math.random() * 400 + 50;
        }

        // Spawn pichkaaris
        if (time - this._lastPichkaariTime > this._nextPichkaariDelay) {
            if (this._pichkaaris.length < this.maxPichkaaris) {
                this._pichkaaris.push(new Pichkaari(w, h, this.colors));
                if (Math.random() > 0.7) {
                    this._pichkaaris.push(new Pichkaari(w, h, this.colors));
                }
            }
            this._lastPichkaariTime = time;
            this._nextPichkaariDelay = Math.random() * 1500 + 800;
        }

        // Cap splashes to avoid unbounded growth
        while (this._splashes.length > MAX_SPLASHES) {
            this._splashes.shift();
        }

        // Update & draw splashes
        for (let i = 0; i < this._splashes.length; i++) {
            this._splashes[i].update();
        }
        filterInPlace(this._splashes, (s) => s.life < s.maxLife);
        for (let i = 0; i < this._splashes.length; i++) {
            this._splashes[i].draw(ctx);
        }

        // Update & draw balloons
        const remainingBalloons = [];
        for (let i = 0; i < this._balloons.length; i++) {
            const balloon = this._balloons[i];
            const splash = balloon.update(w, h);
            if (splash) this._splashes.push(splash);
            if (balloon.active) {
                remainingBalloons.push(balloon);
                balloon.draw(ctx);
            }
        }
        this._balloons = remainingBalloons;

        // Update & draw pichkaaris
        const remainingPichkaaris = [];
        for (let i = 0; i < this._pichkaaris.length; i++) {
            const pichkaari = this._pichkaaris[i];
            pichkaari.update();
            if (pichkaari.active) {
                remainingPichkaaris.push(pichkaari);
                pichkaari.draw(ctx);
            }
        }
        this._pichkaaris = remainingPichkaaris;

        this._animationId = requestAnimationFrame((t) => this._render(t));
    }

    /** Start the overlay animation */
    start() {
        if (this._running) return this;

        this._createCanvas();
        this._setSize();

        // Debounced resize handler — prevents layout thrashing on window drag
        this._resizeHandler = () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this._setSize(), 100);
        };
        window.addEventListener('resize', this._resizeHandler);

        this._running = true;
        this._firstFrame = true;
        this._animationId = requestAnimationFrame((t) => this._render(t));

        return this;
    }

    /** Stop and remove the overlay */
    stop() {
        this._running = false;
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
        if (this._resizeTimer) {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = null;
        }
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
        if (this._canvas && this._canvas.parentNode) {
            this._canvas.parentNode.removeChild(this._canvas);
        }
        this._canvas = null;
        this._ctx = null;
        this._balloons = [];
        this._splashes = [];
        this._pichkaaris = [];
        this._ambientCorners = [];

        if (_instance === this) _instance = null;
        return this;
    }

    /** Check if the overlay is currently running */
    isRunning() {
        return this._running;
    }

    /** Toggle the overlay on/off */
    toggle() {
        if (this._running) {
            this.stop();
        } else {
            this.start();
        }
        return this;
    }
}

// ─────────────────────────────────────────────
// Public API (singleton by default)
// ─────────────────────────────────────────────

/** Library version */
const version = '1.0.0';

/** Default color palette — useful for reference or extending */
const defaultColors = DEFAULT_COLORS;

/**
 * Start a Holi overlay with the given options.
 * Returns the controller instance for later control.
 *
 * @param {Object} [options]
 * @returns {HoliOverlayController}
 */
function start(options) {
    // Stop any existing instance
    if (_instance) _instance.stop();
    _instance = new HoliOverlayController(options);
    _instance.start();
    return _instance;
}

/**
 * Stop the current overlay instance.
 */
function stop() {
    if (_instance) {
        _instance.stop();
        _instance = null;
    }
}

/**
 * Toggle the overlay on/off.
 * @param {Object} [options] - Options used if starting fresh
 */
function toggle(options) {
    if (_instance && _instance.isRunning()) {
        _instance.stop();
        _instance = null;
    } else {
        start(options);
    }
}

/**
 * Check if the overlay is currently active.
 * @returns {boolean}
 */
function isRunning() {
    return _instance ? _instance.isRunning() : false;
}

/**
 * Create a new controller without starting it.
 * For advanced use: multiple overlays, custom lifecycle.
 *
 * @param {Object} [options]
 * @returns {HoliOverlayController}
 */
function create(options) {
    return new HoliOverlayController(options);
}

// ─────────────────────────────────────────────
// Default export (convenience object)
// ─────────────────────────────────────────────
const HoliOverlay = {
    version,
    start,
    stop,
    toggle,
    isRunning,
    create,
    defaultColors,
    DEFAULT_COLORS,
    HoliOverlayController
};

    // ─── Auto-init via data attributes ───
    if (typeof document !== 'undefined') {
        var _currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        if (_currentScript && _currentScript.hasAttribute('data-autostart')) {
            var _ready = function () {
                var opts = {};
                if (_currentScript.getAttribute('data-z-index')) opts.zIndex = parseInt(_currentScript.getAttribute('data-z-index'), 10);
                if (_currentScript.getAttribute('data-opacity')) opts.opacity = parseFloat(_currentScript.getAttribute('data-opacity'));
                if (_currentScript.getAttribute('data-max-balloons')) opts.maxBalloons = parseInt(_currentScript.getAttribute('data-max-balloons'), 10);
                if (_currentScript.getAttribute('data-max-pichkaaris')) opts.maxPichkaaris = parseInt(_currentScript.getAttribute('data-max-pichkaaris'), 10);
                if (_currentScript.getAttribute('data-duration')) opts.duration = parseInt(_currentScript.getAttribute('data-duration'), 10);
                HoliOverlay.start(opts);
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', _ready);
            } else {
                _ready();
            }
        }
    }

    return HoliOverlay;
}));
