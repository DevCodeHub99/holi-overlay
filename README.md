<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/artist-palette_1f3a8.png" width="80" alt="Holi Overlay" />
</p>

<h1 align="center">Holi Overlay</h1>

<p align="center">
  <strong>Add stunning Holi festival celebration effects to any website with a single line of code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/size-~27KB_UMD-00bfff?style=flat-square" alt="Size" />
  <img src="https://img.shields.io/badge/dependencies-zero-32cd32?style=flat-square" alt="Zero Dependencies" />
  <img src="https://img.shields.io/badge/license-MIT-ffdf00?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/module-ESM-9400d3?style=flat-square" alt="ESM" />
  <img src="https://img.shields.io/badge/typescript-included-3178c6?style=flat-square" alt="TypeScript" />
</p>

---

## 🎬 What It Does

Holi Overlay renders a full-screen canvas animation featuring:

| Effect | Description |
|--------|-------------|
| 🎈 **Water Balloons** | Colorful balloons fly in from all 4 sides, burst on-screen with splash physics |
| 💦 **Pichkaari Streams** | Water gun streams shoot across the screen with dense particle trails |
| 🌈 **Ambient Gradients** | Breathing, pulsing color gradients in every corner for atmosphere |
| ✨ **Splash Particles** | Realistic burst particles (water droplets + powder clouds) on balloon impact |

The overlay sits on top of your existing page using `position: fixed` with `pointer-events: none`, so your website remains fully interactive beneath it.

---

## 📦 Installation

### Method 1: CDN (No Build Tools Required)

The fastest way — just paste two lines before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start();</script>
```

### Method 2: npm / yarn / pnpm

```bash
# npm
npm install holi-overlay

# yarn
yarn add holi-overlay

# pnpm
pnpm add holi-overlay
```

Then import in your JavaScript:

```javascript
import HoliOverlay from 'holi-overlay';

HoliOverlay.start();
```

### Method 3: Self-Hosted

Download `dist/holi-overlay.umd.js` from this repository and serve it from your own server:

```html
<script src="/assets/js/holi-overlay.umd.js"></script>
<script>HoliOverlay.start();</script>
```

---

## 🚀 Quick Start

### Simplest Integration (2 Lines)

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start();</script>
```

### Auto-Start via Data Attributes (Zero JavaScript)

```html
<script 
  src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"
  data-autostart
  data-max-balloons="10"
  data-duration="30000"
></script>
```

Available `data-*` attributes:

| Attribute | Maps To |
|-----------|---------|
| `data-autostart` | Enables auto-start on page load |
| `data-z-index` | `zIndex` option |
| `data-opacity` | `opacity` option |
| `data-max-balloons` | `maxBalloons` option |
| `data-max-pichkaaris` | `maxPichkaaris` option |
| `data-duration` | `duration` option (ms) |

### Start with Custom Options

```javascript
HoliOverlay.start({
  maxBalloons: 12,
  maxPichkaaris: 3,
  opacity: 0.9,
  duration: 60000  // Auto-stop after 60 seconds
});
```

---

## 🔗 Framework Integration Guides

### React

```jsx
import { useEffect } from 'react';
import HoliOverlay from 'holi-overlay';

function App() {
  useEffect(() => {
    const overlay = HoliOverlay.start({
      maxBalloons: 12,
      duration: 30000
    });

    // Cleanup on unmount
    return () => overlay.stop();
  }, []);

  return <div>Your App Content</div>;
}
```

**Controlled by state:**

```jsx
import { useEffect } from 'react';
import HoliOverlay from 'holi-overlay';

function FestiveApp({ showHoli }) {
  useEffect(() => {
    if (showHoli) {
      HoliOverlay.start();
    } else {
      HoliOverlay.stop();
    }
    return () => HoliOverlay.stop();
  }, [showHoli]);

  return <div>...</div>;
}
```

### Next.js (App Router)

```tsx
// components/HoliFestive.tsx
'use client';

import { useEffect } from 'react';
import HoliOverlay from 'holi-overlay';

export default function HoliFestive() {
  useEffect(() => {
    const overlay = HoliOverlay.start({
      zIndex: 99999,
      maxBalloons: 10,
      maxPichkaaris: 3
    });
    return () => overlay.stop();
  }, []);

  return null;
}
```

```tsx
// layout.tsx or page.tsx
import HoliFestive from './components/HoliFestive';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <HoliFestive />
    </>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

const HoliFestive = dynamic(() => import('../components/HoliFestive'), {
  ssr: false
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <HoliFestive />
    </>
  );
}
```

### Vue.js 3 (Composition API)

```vue
<script setup>
import { onMounted, onUnmounted } from 'vue';
import HoliOverlay from 'holi-overlay';

let overlay;

onMounted(() => {
  overlay = HoliOverlay.start({
    maxBalloons: 12,
    duration: 60000
  });
});

onUnmounted(() => {
  if (overlay) overlay.stop();
});
</script>
```

### Vue.js 2 (Options API)

```javascript
import HoliOverlay from 'holi-overlay';

export default {
  data() {
    return { overlay: null };
  },
  mounted() {
    this.overlay = HoliOverlay.start({ maxBalloons: 12 });
  },
  beforeDestroy() {
    if (this.overlay) this.overlay.stop();
  }
};
```

### Angular

```typescript
// holi-overlay.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import HoliOverlay from 'holi-overlay';

@Component({
  selector: 'app-holi-overlay',
  template: ''
})
export class HoliOverlayComponent implements OnInit, OnDestroy {
  private overlay: any;

  ngOnInit() {
    this.overlay = HoliOverlay.start({
      maxBalloons: 10,
      duration: 60000
    });
  }

  ngOnDestroy() {
    if (this.overlay) this.overlay.stop();
  }
}
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import HoliOverlay from 'holi-overlay';

  let overlay;

  onMount(() => {
    overlay = HoliOverlay.start({ maxBalloons: 12 });
  });

  onDestroy(() => {
    if (overlay) overlay.stop();
  });
</script>
```

### WordPress

**Option A: Via `functions.php`**

```php
// Add to your theme's functions.php
function add_holi_overlay() {
    wp_enqueue_script(
        'holi-overlay',
        'https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js',
        array(),
        '1.0.0',
        true
    );
    wp_add_inline_script(
        'holi-overlay',
        'HoliOverlay.start({ maxBalloons: 10, duration: 60000 });'
    );
}
add_action('wp_enqueue_scripts', 'add_holi_overlay');
```

**Option B: Via Theme Footer**

Paste in your theme's `footer.php` before `</body>`:

```html
<script
  src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"
  data-autostart
  data-duration="60000"
></script>
```

**Option C: Via Custom HTML Block (Gutenberg)**

Add a "Custom HTML" block to any page/post:

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start({ duration: 30000 });</script>
```

### Shopify

Add to your theme's `theme.liquid` before `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start({ duration: 60000 });</script>
```

### Wix (Custom Code)

Go to **Settings → Custom Code → Body End** and paste:

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start({ duration: 30000 });</script>
```

### Squarespace

Go to **Settings → Advanced → Code Injection → Footer** and paste:

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start({ duration: 30000 });</script>
```

### Google Tag Manager

Create a **Custom HTML** tag with trigger "All Pages":

```html
<script src="https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js"></script>
<script>HoliOverlay.start({ duration: 30000 });</script>
```

---

## ⚙️ Configuration Options

Pass an options object to `HoliOverlay.start()`:

```javascript
HoliOverlay.start({
  zIndex: 99999,
  opacity: 0.95,
  maxBalloons: 15,
  maxPichkaaris: 4,
  colors: [...],
  duration: 0,
  container: 'body'
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `zIndex` | `number` | `99999` | CSS z-index of the overlay canvas. Set higher if your site uses high z-index values. |
| `opacity` | `number` | `0.95` | Overall opacity of the overlay (0 = invisible, 1 = fully opaque). |
| `maxBalloons` | `number` | `15` | Maximum number of water balloons on screen simultaneously. Higher = more festive. |
| `maxPichkaaris` | `number` | `4` | Maximum number of water gun streams simultaneously. Higher = more chaotic. |
| `colors` | `Array<{r,g,b}>` | *9 Holi colors* | Custom color palette. Each color is an object with `r`, `g`, `b` (0-255). |
| `duration` | `number` | `0` | Auto-stop after N milliseconds. `0` means run forever until `.stop()` is called. |
| `container` | `string` | `body` | CSS selector for the container where the canvas is appended. |

### Preset Examples

**Subtle / Minimal:**
```javascript
HoliOverlay.start({
  maxBalloons: 5,
  maxPichkaaris: 1,
  opacity: 0.5
});
```

**Party Mode / Maximum Festivity:**
```javascript
HoliOverlay.start({
  maxBalloons: 25,
  maxPichkaaris: 8,
  opacity: 1.0
});
```

**Brand Colors:**
```javascript
HoliOverlay.start({
  colors: [
    { r: 255, g: 0, b: 100 },   // Brand pink
    { r: 0, g: 200, b: 255 },   // Brand blue
    { r: 255, g: 200, b: 0 },   // Brand gold
    { r: 100, g: 255, b: 100 }  // Brand green
  ]
});
```

**Timed Celebration (30 seconds):**
```javascript
HoliOverlay.start({
  maxBalloons: 12,
  duration: 30000  // Stops after 30 seconds
});
```

---

## 🔌 API Reference

### Static Methods (Singleton)

These manage a single global overlay instance:

```javascript
// Start the overlay with optional configuration
const controller = HoliOverlay.start(options?);

// Stop and remove the overlay
HoliOverlay.stop();

// Toggle on/off — calls start(options) if stopped, or stop() if running
HoliOverlay.toggle(options?);

// Check if the overlay is currently running
HoliOverlay.isRunning();  // → boolean
```

### Factory Method (Multiple Instances)

For advanced use cases (e.g., different configurations on different pages):

```javascript
// Create a controller without starting it
const controller = HoliOverlay.create(options?);

// Manually start
controller.start();

// Check status
controller.isRunning();  // → boolean

// Toggle
controller.toggle();

// Stop and cleanup
controller.stop();
```

### Properties

```javascript
HoliOverlay.version         // → '1.0.0'
HoliOverlay.defaultColors   // → Array of 9 default Holi colors
```

---

## 🏗 Building from Source

### Prerequisites

- Node.js 14+ installed

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/holi-overlay.git
cd holi-overlay

# Build distribution files
npm run build

# Start the demo page
npm run dev
```

### Build Output

| File | Size | Purpose |
|------|------|---------|
| `dist/holi-overlay.js` | ~25 KB | ESM — Full version with comments (primary) |
| `dist/holi-overlay.min.js` | ~15 KB | ESM — Minified (tree-shakeable) |
| `dist/holi-overlay.umd.js` | ~27 KB | UMD — For CDN `<script>` tags (browser global) |
| `dist/holi-overlay.cjs` | ~27 KB | CJS — For Node.js `require()` |
| `dist/holi-overlay.d.ts` | ~2.2 KB | TypeScript type declarations |

---

## 🔧 Publishing to npm

### First-Time Setup

1. Create an account at [npmjs.com](https://www.npmjs.com/signup)
2. Login from your terminal:
   ```bash
   npm login
   ```
3. Update `package.json` with your info:
   - Set `repository.url` to your GitHub repo URL
   - Set `homepage` to your demo/docs URL
   - Set `bugs.url` to your GitHub issues URL

### Publish

```bash
# Build first (runs automatically via prepublishOnly)
npm publish
```

After publishing, anyone can install it with:
```bash
npm install holi-overlay
```

And the CDN link becomes active at:
```
https://cdn.jsdelivr.net/npm/holi-overlay@latest/dist/holi-overlay.umd.js
```

---

## 🛡 Performance & Best Practices

### How It Performs

- **Particle budget**: Pichkaari streams are capped at 600 particles each, splashes capped at 30 simultaneously — prevents runaway memory usage
- **GC-friendly**: Hot render loop uses in-place array filtering instead of `Array.filter()` to avoid garbage collection pauses
- **Debounced resize**: Window resize handler is debounced at 100ms to prevent layout thrashing during window drag
- **`requestAnimationFrame`**: All animation runs at native screen refresh rate, pauses when tab is inactive
- **`pointer-events: none`**: The canvas never intercepts clicks — your page stays fully interactive
- **`aria-hidden: true`**: Screen readers properly ignore the decorative canvas

### Recommended Settings for Production

```javascript
// Safe defaults for production use
HoliOverlay.start({
  maxBalloons: 8,       // Low enough for decent frame rate on mobile
  maxPichkaaris: 2,     // Each stream creates many particles
  opacity: 0.8,         // Subtle enough to not hide content
  duration: 30000,      // Auto-stop after 30 seconds
  zIndex: 99999         // Sits above most elements
});
```

### Mobile Considerations

The overlay works on mobile devices, but for the best experience:

```javascript
// Detect mobile and reduce intensity
const isMobile = window.innerWidth < 768;
HoliOverlay.start({
  maxBalloons: isMobile ? 5 : 15,
  maxPichkaaris: isMobile ? 1 : 4,
  duration: 20000
});
```

---

## 🧩 Advanced Usage

### Toggle with a Button

```html
<button onclick="HoliOverlay.toggle()">🎨 Toggle Holi Mode</button>
```

### Schedule for a Specific Date

```javascript
const today = new Date();
const holiDate = new Date(today.getFullYear(), 2, 14); // March 14 (adjust yearly)

if (today.toDateString() === holiDate.toDateString()) {
  HoliOverlay.start({ duration: 60000 });
}
```

### Trigger on User Action

```javascript
document.getElementById('celebrate-btn').addEventListener('click', () => {
  if (!HoliOverlay.isRunning()) {
    HoliOverlay.start({ duration: 15000 });
  }
});
```

### Multiple Overlays (Advanced)

```javascript
const overlay1 = HoliOverlay.create({ maxBalloons: 5, opacity: 0.5 });
const overlay2 = HoliOverlay.create({ maxBalloons: 10, opacity: 0.8 });

overlay1.start();
overlay2.start();

// Later
overlay1.stop();
overlay2.stop();
```

---

## 📁 Project Structure

```
holi-overlay/
├── src/
│   ├── holi-overlay.js    # Core library (native ES Module)
│   └── react.jsx          # React wrapper component
├── dist/                  # Built files (auto-generated)
│   ├── holi-overlay.js    # ESM (primary)
│   ├── holi-overlay.min.js # ESM (minified)
│   ├── holi-overlay.umd.js # UMD (CDN / <script> tags)
│   ├── holi-overlay.cjs   # CJS (Node.js require)
│   └── holi-overlay.d.ts  # TypeScript declarations
├── demo.html              # Interactive demo / landing page
├── build.js               # Zero-dependency build script (ESM)
├── package.json           # type: "module", conditional exports
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-effect`
3. Commit your changes: `git commit -m 'Add amazing new effect'`
4. Push to the branch: `git push origin feature/amazing-effect`
5. Open a Pull Request

---

## 📄 License

MIT © Vikas

Free for personal and commercial use. Attribution appreciated but not required.
