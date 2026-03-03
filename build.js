/**
 * Build script — generates distribution files from ESM source.
 * Produces:
 *   - dist/holi-overlay.js       → ESM (primary, full)
 *   - dist/holi-overlay.min.js   → ESM minified
 *   - dist/holi-overlay.umd.js   → UMD for CDN <script> tags (browser global)
 *   - dist/holi-overlay.d.ts     → TypeScript declarations
 *
 * No external dependencies required.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.join(__dirname, 'src', 'holi-overlay.js');
const DIST = path.join(__dirname, 'dist');

// Clean and recreate dist directory
if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Read ESM source
const source = fs.readFileSync(SRC, 'utf-8');

// ─── 1. Write full ESM version ───
fs.writeFileSync(path.join(DIST, 'holi-overlay.js'), source, 'utf-8');

// ─── 2. Write minified ESM version ───
let minified = source
    .replace(/\/\*[\s\S]*?\*\//g, '')     // Remove block comments
    .replace(/\/\/.*$/gm, '')             // Remove single-line comments
    .replace(/^\s+/gm, '')               // Remove leading whitespace
    .replace(/\n{2,}/g, '\n')            // Collapse multiple newlines
    .split('\n').filter(line => line.trim().length > 0).join('\n');

fs.writeFileSync(path.join(DIST, 'holi-overlay.min.js'), minified, 'utf-8');

// ─── 3. Generate UMD wrapper for CDN / <script> tag usage ───
// Transform ESM export statements into local declarations, then build UMD around them
let umdCore = source
    // Remove `export default HoliOverlay;` at end
    .replace(/^export\s+default\s+\w+;\s*$/gm, '')
    // `export const X =` → `const X =`
    .replace(/^export\s+const\s+/gm, 'const ')
    // `export let X =` → `let X =`
    .replace(/^export\s+let\s+/gm, 'let ')
    // `export function X` → `function X`
    .replace(/^export\s+function\s+/gm, 'function ')
    // `export class X` → `class X`
    .replace(/^export\s+class\s+/gm, 'class ')
    // Remove @module JSDoc line
    .replace(/^\s*\*\s*@module\s+\S+\s*$/gm, '')
    .trim();

const umdContent = `/**
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

${umdCore}

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
`;

fs.writeFileSync(path.join(DIST, 'holi-overlay.umd.js'), umdContent, 'utf-8');
// Also write as .cjs for Node.js require() (since package.json has "type": "module")
fs.writeFileSync(path.join(DIST, 'holi-overlay.cjs'), umdContent, 'utf-8');

// ─── 4. Generate TypeScript declarations ───
const dtsContent = `/**
 * Holi Overlay — Festive celebration effect for any website
 * @version 1.0.0
 * @module holi-overlay
 */

export interface HoliColor {
    r: number;
    g: number;
    b: number;
}

export interface HoliOverlayOptions {
    /** CSS z-index for the overlay canvas (default: 99999) */
    zIndex?: number;
    /** Overall opacity of the overlay, 0-1 (default: 0.95) */
    opacity?: number;
    /** Maximum simultaneous balloons (default: 15) */
    maxBalloons?: number;
    /** Maximum simultaneous water gun streams (default: 4) */
    maxPichkaaris?: number;
    /** CSS selector for container element (default: body) */
    container?: string;
    /** Custom color palette */
    colors?: HoliColor[];
    /** Auto-stop after N milliseconds. 0 = infinite (default: 0) */
    duration?: number;
}

export declare class HoliOverlayController {
    constructor(options?: HoliOverlayOptions);
    /** Start the overlay animation */
    start(): HoliOverlayController;
    /** Stop and remove the overlay */
    stop(): HoliOverlayController;
    /** Check if running */
    isRunning(): boolean;
    /** Toggle on/off */
    toggle(): HoliOverlayController;
}

/** Library version */
export declare const version: string;

/** Default color palette */
export declare const DEFAULT_COLORS: HoliColor[];
export declare const defaultColors: HoliColor[];

/** Start a new overlay with options */
export declare function start(options?: HoliOverlayOptions): HoliOverlayController;
/** Stop the current overlay */
export declare function stop(): void;
/** Toggle the overlay on/off */
export declare function toggle(options?: HoliOverlayOptions): void;
/** Check if active */
export declare function isRunning(): boolean;
/** Create a controller without starting */
export declare function create(options?: HoliOverlayOptions): HoliOverlayController;

declare const HoliOverlay: {
    version: string;
    start: typeof start;
    stop: typeof stop;
    toggle: typeof toggle;
    isRunning: typeof isRunning;
    create: typeof create;
    defaultColors: HoliColor[];
    DEFAULT_COLORS: HoliColor[];
    HoliOverlayController: typeof HoliOverlayController;
};

export default HoliOverlay;
`;
fs.writeFileSync(path.join(DIST, 'holi-overlay.d.ts'), dtsContent, 'utf-8');

// ─── Report ───
console.log('✅ Build complete!');
console.log('   dist/holi-overlay.js      — ESM (full)');
console.log('   dist/holi-overlay.min.js  — ESM (minified)');
console.log('   dist/holi-overlay.umd.js  — UMD (CDN / <script> tags)');
console.log('   dist/holi-overlay.cjs     — CJS (Node.js require)');
console.log('   dist/holi-overlay.d.ts    — TypeScript types');

const esmSize = fs.statSync(path.join(DIST, 'holi-overlay.js')).size;
const minSize = fs.statSync(path.join(DIST, 'holi-overlay.min.js')).size;
const umdSize = fs.statSync(path.join(DIST, 'holi-overlay.umd.js')).size;
console.log(`   ESM: ${(esmSize / 1024).toFixed(1)} KB | Min: ${(minSize / 1024).toFixed(1)} KB | UMD: ${(umdSize / 1024).toFixed(1)} KB`);
