# Webcode-Embed

A lightweight web component for displaying code snippets with syntax highlighting alongside a live preview in an iframe. Design heavily inspired by [Codepen](https://codepen.io/).  

## Demo

## Features

- **Syntax highlighting** powered by [Shiki](https://shiki.style)
- **Responsive design** - side-by-side on desktop (≥ breakpoint), single preview at a time (< breakpoint)
- **Customizable themes** - choose from 100+ Shiki themes
- **Multi-file support** - display HTML, CSS, JS, and more
- **Interactive toggles** - show/hide code and preview panels independently on desktop
- **Zero dependencies** (except Shiki)

## Responsive Behavior

- **Desktop (≥ breakpoint)**: Code and preview panels side-by-side. Both can be toggled independently.
- **Mobile (< breakpoint)**: Panels stack vertically. Only one panel visible at a time.

## Installation

### NPM (Coming Soon)

### Direct Installation

1. Download `webcode-embed.bundle.js` from the dist folder
2. Add it to your project
3. Import via script tag:

```html
<script type="module" src="path/to/webcode-embed.bundle.js"></script>
```

## Usage

### Basic Example

```html
<webcode-embed
    files="/example/example.html /example/example.css /example/example.js"
    theme="vitesse-dark">
</webcode-embed>
```

### With Fallback Content

```html
<webcode-embed files="/app.html /app.css" theme="github-dark">
    <div style="text-align: center; padding: 50px;">
        <p>Please enable JavaScript to view code previews</p>
    </div>
</webcode-embed>
```

_Note: The fallback content can be anything you like. This is just an example._

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

See all available themes at [shiki.style/themes](https://shiki.style/themes)

```html
theme="github-dark"
theme="nord"
theme="monokai"
```

### `langs` (optional)

Space-separated list of languages to load. Default: `html css javascript`

**Important:** If using languages other than HTML/CSS/JS, you must specify them here.

```html
langs="python json yaml"
langs="typescript tsx"
```

Refer to [Shiki's language list](https://shiki.style/languages) for valid language names.

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

## Examples

### HTML + CSS + JavaScript

```html
<webcode-embed
    files="/demo.html /styles.css /app.js"
    theme="vitesse-dark">
</webcode-embed>
```

### Python + JSON

```html
<webcode-embed
    files="/app.py /config.json"
    langs="python json"
    theme="github-dark">
</webcode-embed>
```

### TypeScript + React

```html
<webcode-embed
    files="/App.tsx /types.ts"
    langs="tsx typescript"
    theme="nord"
    start-index="0">
</webcode-embed>
```

### Custom Breakpoint

```html
<webcode-embed
    files="/responsive.html /responsive.css"
    breakpoint="60em"
    theme="monokai">
</webcode-embed>
```

_Note: If there is no html file found in the `files` attribute, the iframe will not be displayed._

## Browser Support

Requires modern browsers with ES11 support.
