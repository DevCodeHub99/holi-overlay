/**
 * React wrapper for Holi Overlay (ES Module)
 *
 * Usage:
 *   import { HoliOverlayReact } from 'holi-overlay/react';
 *   <HoliOverlayReact />
 *
 *   // Or use the core library directly:
 *   import HoliOverlay from 'holi-overlay';
 *   HoliOverlay.start();
 */
import { useEffect, useRef } from 'react';
import HoliOverlay from './holi-overlay.js';

/**
 * React component that starts / stops the Holi Overlay effect.
 * Renders nothing to the DOM — the overlay is managed via a <canvas> element.
 *
 * @param {Object} props
 * @param {number}  [props.zIndex=99999]       CSS z-index for the overlay
 * @param {number}  [props.opacity=0.95]       Opacity (0-1)
 * @param {number}  [props.maxBalloons=15]     Max simultaneous balloons
 * @param {number}  [props.maxPichkaaris=4]    Max simultaneous water gun streams
 * @param {Array}   [props.colors]             Custom color palette [{r,g,b}, ...]
 * @param {number}  [props.duration=0]         Auto-stop after N ms (0 = infinite)
 * @param {string}  [props.container]          CSS selector for container element
 * @param {boolean} [props.active=true]        Whether the overlay should be active
 */
export function HoliOverlayReact({
    zIndex = 99999,
    opacity = 0.95,
    maxBalloons = 15,
    maxPichkaaris = 4,
    colors,
    duration = 0,
    container,
    active = true
}) {
    const controllerRef = useRef(null);

    useEffect(() => {
        if (!active) return;

        controllerRef.current = HoliOverlay.create({
            zIndex,
            opacity,
            maxBalloons,
            maxPichkaaris,
            colors,
            duration,
            container
        });
        controllerRef.current.start();

        return () => {
            if (controllerRef.current) {
                controllerRef.current.stop();
                controllerRef.current = null;
            }
        };
    }, [active, zIndex, opacity, maxBalloons, maxPichkaaris, duration, container]);

    return null; // This component renders nothing — it's canvas-based
}

export default HoliOverlayReact;
