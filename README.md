# Webcode-Embed

A lightweight web component for displaying code snippets with syntax highlighting alongside a live preview in an iframe. Design heavily inspired by [Codepen](https://codepen.io/).


## Quick Start
Upcoming...

## Demo

[View Live Demo](https://yourdemo.com) <!-- TODO: Add demo link -->

## Features

- **Syntax highlighting** powered by [Shiki](https://shiki.style)
- **Responsive design** - side-by-side on desktop (≥ breakpoint), stacked on mobile
- **Popular themes included** - VS Code Dark+, VS Code Light+, Nord, Dracula, Material Theme, and more
- **Supports HTML, CSS and JavaScript** (and many more languages via Shiki, see bundle used)
- **Interactive toggles** - show/hide code and preview panels independently on desktop
- **Minimal dependencies** - Only Shiki for syntax highlighting

## Responsive Behavior

- **Desktop (≥ breakpoint)**: Code and preview panels side-by-side. Both can be toggled independently.
- **Mobile (< breakpoint)**:
  - With HTML preview: Shows preview by default, code can be toggled
  - Without HTML preview: Shows code (no hiding on mobile)

## Installation

### NPM (Coming Soon)

```bash
npm install webcode-embed
```

```html
<script type="module" src="path/to/webcode-embed.min.js"></script>
```

## Usage

### Basic Example

```html
<webcode-embed
    files="/example/example.html /example/example.css">
</webcode-embed>
```

### With Custom Theme

```html
<webcode-embed
    files="/example/example.html /example/example.css"
    theme="nord">
</webcode-embed>
```

### Custom Height

```html
<webcode-embed
    files="/example/tall-page.html /example/tall-page.css"
    height="700px">
</webcode-embed>
```

## Attributes

### `files` (required)

Space-separated file paths to display. The first HTML file found will be used for the iframe preview.

```html
files="/index.html /styles.css /script.js"
```

### `height` (optional)
height of your web component. You may specify in any css valid unit. Default: `500px`

```html
height="500px"
height="100%"
height="calc(100vh - 200px)"
```

### `theme` (optional)

Shiki theme for syntax highlighting. Default: `vitesse-dark`

**Included themes:**
- `vitesse-dark` - Default, elegant dark theme
- `dark-plus` / `light-plus` - VS Code's default themes
- `nord` - Arctic, low-contrast palette
- `dracula` - Vibrant, high-contrast colors
- `github-dark` / `github-light` - GitHub's themes
- `monokai` - Classic, widely-loved theme
- `material-theme` / `material-theme-palenight` - Material Design themes

See all ~200 available themes at [shiki.style/themes](https://shiki.style/themes)

```html
theme="nord"
theme="dracula"
theme="dark-plus"
```

**Note:** This component uses `shiki/bundle/web` which includes all themes. Only the theme you specify will be applied.

### `start-index` (optional)

Which file to display initially (0-based index). Default: `0`

```html
<!-- Start with the CSS file (index 1) -->
<webcode-embed
    files="/index.html /styles.css /script.js"
    start-index="1">
</webcode-embed>
```

### `breakpoint` (optional)

Screen width where desktop layout activates. Default: `39.9375em` (639px)

```html
breakpoint="48em"
```

## License

[MIT](https://github.com/zapalblizh/webcode-embed/blob/main/LICENSE)
