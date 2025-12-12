/**
 * Vue 3 composable for creating customizable snowfall effects
 * @param {Object} options - Configuration options
 */
export function useSnowfall(options = {}) {
  const {
    container = document.body,
    interval = 500,
    minSpeed = 20,
    maxSpeed = 30,
    minSize = 10,
    maxSize = 30,
    color = '#fff',
    zIndex = 999,
    maxFlakes = null,
    chaos = 50
  } = options

  let flakeIntervalId = null
  let cleanupIntervalId = null
  let styleElement = null
  let containerElement = null
  const activeFlakes = new Set()
  const chaosMultiplier = Math.max(0, Math.min(100, chaos)) / 50

  const getContainer = () => {
    if (!containerElement) {
      if (typeof container === 'string') {
        containerElement = document.querySelector(container)
        if (!containerElement) {
          console.warn(`Container selector "${container}" not found, using document.body`)
          containerElement = document.body
        }
      } else if (container instanceof HTMLElement) {
        containerElement = container
      } else {
        containerElement = document.body
      }
    }
    return containerElement
  }

  const addStyles = () => {
    if (styleElement) return
    styleElement = document.createElement('style')
    styleElement.setAttribute('data-vue-snowfall', 'true')
    styleElement.textContent = `.vue-snowfall-flake{position:absolute;top:-20px;z-index:${zIndex};pointer-events:none;will-change:transform,opacity}@keyframes vue-snowfall-fall{0%{transform:translateX(0) translateY(0) rotate(0deg);opacity:1}50%{transform:translateX(var(--snow-x)) translateY(50vh) rotate(180deg);opacity:.9}100%{transform:translateX(var(--snow-x-end)) translateY(100vh) rotate(360deg);opacity:0}}`
    document.head.appendChild(styleElement)
  }

  const removeStyles = () => {
    if (styleElement) {
      styleElement.remove()
      styleElement = null
    }
  }

  const random = (min, max) => Math.random() * (max - min) + min
  const randomInt = (min, max) => Math.floor(random(min, max + 1))

  const createSnowflake = () => {
    if (maxFlakes !== null && activeFlakes.size >= maxFlakes) {
      return null
    }

    const containerEl = getContainer()
    const fallingTime = random(minSpeed, maxSpeed)
    const flakePos = randomInt(1, 99)
    const flakeSize = Math.round(random(minSize, maxSize))
    
    if (flakeSize <= 0) return null

    const maxDeviation = 100 * chaosMultiplier
    const xDeviation = random(-maxDeviation, maxDeviation)
    const xDeviationEnd = random(-maxDeviation * 0.5, maxDeviation * 0.5)

    const snowflake = document.createElement('div')
    snowflake.className = 'vue-snowfall-flake'
    snowflake.style.left = `${flakePos}%`
    snowflake.style.width = `${flakeSize}px`
    snowflake.style.height = `${flakeSize}px`
    snowflake.style.setProperty('--snow-x', `${xDeviation}px`)
    snowflake.style.setProperty('--snow-x-end', `${xDeviationEnd}px`)
    snowflake.style.animation = `vue-snowfall-fall ${fallingTime}s linear forwards`
    snowflake.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 50 55" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42.29 35.38L50 39.81l-1.77 3.05-7.78-4.47 2.04 7.58-3.4.91-3.34-9.92-.36-1.04-9.32-5.37v10.83l.68.7 7.34 7.32-2.48 2.48-5.54-5.55v8.67h-3.48v-8.76l-5.62 5.55-2.54-2.48 6.79-7.35.83-.76v-10.74l-9.42 5.37-.34 1.04-2.68 9.92-3.41-.92 2.04-7.58-7.79 4.47L0 39.81l7.71-4.43-7.62-2.03.91-3.39 10.06 2.68.97.26 9.43-5.42-9.35-5.38-1.05.28-9.98 2.94-.91-3.39 7.62-2.03L0 15.17l1.77-3.05 7.71 4.43-2.04-7.58 3.41.92 2.68-9.92.35-1.04 9.42-5.37v10.74l-.81.76-6.79 7.35-2.54 2.48 5.62-5.55v8.76h3.48v-8.67l5.54 5.55-2.48-2.48-7.34-7.32.68-.7v-10.83l9.32 5.37.36 1.04 3.34 9.92 3.4-.91-2.04-7.58 7.78 4.47L50 15.17l-1.77 3.05-7.79-4.47 2.04 7.58-3.4.91-2.68-9.92-.35-1.04-9.42 5.37v10.74l9.35 5.38 1.05-.28 9.98-2.94.91 3.39-7.62 2.03 7.79-4.47L50 39.81l-7.71 4.43z" fill="${color}"/></svg>`

    snowflake.addEventListener('animationend', () => {
      removeSnowflake(snowflake)
    }, { once: true })

    containerEl.appendChild(snowflake)
    activeFlakes.add(snowflake)

    return snowflake
  }

  const removeSnowflake = (flake) => {
    if (flake && flake.parentNode) {
      flake.remove()
      activeFlakes.delete(flake)
    }
  }

  const cleanupSnowflakes = () => {
    if (activeFlakes.size === 0) return

    const containerEl = getContainer()
    const containerHeight = containerEl === document.body ? window.innerHeight : containerEl.offsetHeight
    const flakesToRemove = []

    activeFlakes.forEach((flake) => {
      const rect = flake.getBoundingClientRect()
      if (rect.top > containerHeight + 50) {
        flakesToRemove.push(flake)
      }
    })

    flakesToRemove.forEach(removeSnowflake)
  }

  const removeAllSnowflakes = () => {
    activeFlakes.forEach(removeSnowflake)
    activeFlakes.clear()
  }

  const startSnowflakes = () => {
    if (flakeIntervalId) {
      stopSnowflakes()
    }

    removeAllSnowflakes()
    addStyles()
    
    const containerEl = getContainer()
    if (containerEl !== document.body && window.getComputedStyle(containerEl).position === 'static') {
      const originalPosition = containerEl.style.position
      containerEl.style.position = 'relative'
      containerEl.setAttribute('data-vue-snowfall-position', originalPosition || 'static')
    }

    createSnowflake()
    flakeIntervalId = setInterval(createSnowflake, interval)
    cleanupIntervalId = setInterval(cleanupSnowflakes, 2000)
  }

  const stopSnowflakes = () => {
    if (flakeIntervalId) {
      clearInterval(flakeIntervalId)
      flakeIntervalId = null
    }
    if (cleanupIntervalId) {
      clearInterval(cleanupIntervalId)
      cleanupIntervalId = null
    }
    
    removeAllSnowflakes()
    removeStyles()

    if (containerElement && containerElement !== document.body) {
      const originalPosition = containerElement.getAttribute('data-vue-snowfall-position')
      if (originalPosition !== null) {
        containerElement.style.position = originalPosition === 'static' ? '' : originalPosition
        containerElement.removeAttribute('data-vue-snowfall-position')
      }
    }
  }

  return {
    startSnowflakes,
    stopSnowflakes,
  }
}
