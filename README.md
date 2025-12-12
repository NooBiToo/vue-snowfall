<div align="center">
  <a href="https://www.npmjs.com/package/vue-snowfall">
    <img alt="current version" src="https://img.shields.io/npm/v/vue-snowfall">
  </a>
  <img alt="license" src="https://img.shields.io/github/license/NooBiToo/vue-snowfall" />
</div>

# Vue Snowfall

A customizable and performant Vue 3 composable for creating beautiful snowfall effects in your web applications.

## ✨ Features

- 🎨 **Highly Customizable** - Configure speed, size, color, interval, chaos level, and more
- ⚡  **Performant** - Optimized with efficient DOM management, shared CSS animations, and automatic cleanup
- 🎯 **Flexible** - Choose any container element or use the default body
- 🔧 **Easy to Use** - Simple API with sensible defaults
- 📦 **Lightweight** - Small bundle size, no external dependencies
- 🎭 **Vue 3 Compatible** - Built for Vue 3 Composition API

## 📦 Installation

```bash
npm install vue-snowfall
# or
pnpm add vue-snowfall
# or
yarn add vue-snowfall
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { useSnowfall } from 'vue-snowfall'
import { onMounted, onBeforeUnmount } from 'vue'

export default {
  setup() {
    const { startSnowflakes, stopSnowflakes } = useSnowfall()

    onMounted(() => {
      startSnowflakes()
    })

    onBeforeUnmount(() => {
      stopSnowflakes()
    })
  }
}
```

### With Options

```javascript
import { useSnowfall } from 'vue-snowfall'

const { startSnowflakes, stopSnowflakes } = useSnowfall({
  interval: 300,           // Create snowflake every 300ms
  minSpeed: 15,           // Minimum falling speed (seconds)
  maxSpeed: 25,           // Maximum falling speed (seconds)
  minSize: 10,            // Minimum size in pixels
  maxSize: 30,            // Maximum size in pixels
  color: '#ffffff',       // Snowflake color
  zIndex: 999,            // Z-index for snowflakes
  maxFlakes: 100,         // Maximum number of snowflakes (optional)
  chaos: 50,              // Chaos level for random movement (0-100)
  container: document.body // Container element or selector
})

startSnowflakes()
```

## 📖 API Reference

### `useSnowfall(options?)`

Creates a snowfall effect instance.

#### Parameters

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | `HTMLElement \| string` | `document.body` | Container element or CSS selector |
| `interval` | `number` | `500` | Interval between creating snowflakes (ms) |
| `minSpeed` | `number` | `20` | Minimum falling speed (seconds) |
| `maxSpeed` | `number` | `30` | Maximum falling speed (seconds) |
| `minSize` | `number` | `10` | Minimum snowflake size in pixels |
| `maxSize` | `number` | `30` | Maximum snowflake size in pixels |
| `color` | `string` | `'#fff'` | Snowflake color (hex, rgb, etc.) |
| `zIndex` | `number` | `999` | Z-index for snowflakes |
| `maxFlakes` | `number \| null` | `null` | Maximum number of snowflakes (null = unlimited) |
| `chaos` | `number` | `50` | Chaos level for random movement (0-100, higher = more chaotic) |

#### Returns

An object with the following methods:

- `startSnowflakes()` - Start the snowfall animation
- `stopSnowflakes()` - Stop the animation and remove all snowflakes

## 🎨 Examples

### Custom Container

```javascript
import { useSnowfall } from 'vue-snowfall'

const { startSnowflakes, stopSnowflakes } = useSnowfall({
  container: '#snow-container', // CSS selector
  // or
  container: document.querySelector('.my-container') // Element
})

startSnowflakes()
```

### Fast Snowfall

```javascript
const { startSnowflakes } = useSnowfall({
  interval: 200,
  minSpeed: 5,
  maxSpeed: 10
})

startSnowflakes()
```

### Slow, Large Snowflakes

```javascript
const { startSnowflakes } = useSnowfall({
  interval: 1000,
  minSpeed: 30,
  maxSpeed: 50,
  minSize: 20,
  maxSize: 50
})

startSnowflakes()
```

### Colored Snowflakes

```javascript
const { startSnowflakes } = useSnowfall({
  color: '#ff6b9d' // Pink snowflakes!
})

startSnowflakes()
```

### Chaotic Movement

```javascript
const { startSnowflakes } = useSnowfall({
  chaos: 80 // Higher chaos = more random horizontal movement (0-100)
})

startSnowflakes()
```

### Performance Optimization

```javascript
const { startSnowflakes } = useSnowfall({
  maxFlakes: 50, // Limit to 50 snowflakes for better performance
  interval: 400
})

startSnowflakes()
```

## 🔧 Advanced Usage

### Dynamic Configuration

```javascript
import { ref, watch } from 'vue'
import { useSnowfall } from 'vue-snowfall'

const speed = ref(20)
let snowfall = null

watch(speed, (newSpeed) => {
  if (snowfall) {
    snowfall.stopSnowflakes()
  }
  snowfall = useSnowfall({ minSpeed: newSpeed, maxSpeed: newSpeed + 10 })
  snowfall.startSnowflakes()
}, { immediate: true })
```

### Multiple Instances

```javascript
const snowfall1 = useSnowfall({ container: '#container1' })
const snowfall2 = useSnowfall({ container: '#container2', color: '#ff0000' })

snowfall1.startSnowflakes()
snowfall2.startSnowflakes()
```

## 🎯 Performance Tips

1. **Use `maxFlakes`** to limit the number of snowflakes for better performance on low-end devices
2. **Increase `interval`** to create snowflakes less frequently
3. **Use a specific container** instead of `document.body` when possible
4. **Stop snowfall** when not visible (e.g., when component is unmounted or tab is hidden)
5. **Optimized rendering** - The library uses a single shared CSS animation with CSS variables for optimal performance
6. **Automatic cleanup** - Snowflakes are automatically removed when animation completes, reducing memory usage

## 🐛 Troubleshooting

### Snowflakes not appearing

- Make sure the container has a defined height
- Check that the container is visible (not `display: none`)
- Verify that `startSnowflakes()` is called after the container is mounted

### Performance issues

- Reduce `maxFlakes` or increase `interval`
- Use a smaller container instead of the entire body
- Consider stopping snowfall when the page is not visible

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/NooBiToo/vue-snowfall/issues).

---

Made with ❄️ by [Erlan Kaparov](https://github.com/NooBiToo)
