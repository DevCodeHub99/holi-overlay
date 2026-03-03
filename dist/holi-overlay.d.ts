/**
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
