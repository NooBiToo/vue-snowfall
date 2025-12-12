/**
 * Vue 3 composable for creating customizable snowfall effects
 * @param {Object} options - Configuration options
 * @param {HTMLElement|string} [options.container] - Container element or selector (default: document.body)
 * @param {number} [options.interval=500] - Interval between creating snowflakes in ms
 * @param {number} [options.minSpeed=20] - Minimum falling speed in seconds
 * @param {number} [options.maxSpeed=30] - Maximum falling speed in seconds
 * @param {number} [options.minSize=10] - Minimum snowflake size in pixels
 * @param {number} [options.maxSize=30] - Maximum snowflake size in pixels
 * @param {string} [options.color='#fff'] - Snowflake color
 * @param {number} [options.zIndex=999] - Z-index for snowflakes
 * @param {number} [options.maxFlakes] - Maximum number of snowflakes (optional, for performance)
 * @param {number} [options.chaos=50] - Chaos level for random movement (0-100, higher = more chaotic)
 * @returns {Object} Object with startSnowflakes and stopSnowflakes methods
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
  let animationStyleElement = null
  let containerElement = null
  const activeFlakes = new Set()

  // Pre-calculate normalized chaos multiplier
  const chaosMultiplier = Math.max(0, Math.min(100, chaos)) / 50

  /**
   * Get the container element
   * @returns {HTMLElement}
   */
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

  /**
   * Add CSS styles for snowflakes
   */
  const addStyles = () => {
    if (styleElement) return

    styleElement = document.createElement('style')
    styleElement.setAttribute('data-vue-snowfall', 'true')
    
    // Single shared animation using CSS variables for better performance
    const maxDeviation = 100 * chaosMultiplier
    styleElement.textContent = `
      .vue-snowfall-flake {
        position: absolute;
        top: -20px;
        z-index: ${zIndex};
        pointer-events: none;
        will-change: transform, opacity;
      }
      @keyframes vue-snowfall-fall {
        0% {
          transform: translateX(0) translateY(0) rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: translateX(var(--snow-x)) translateY(50vh) rotate(180deg);
          opacity: 0.9;
        }
        100% {
          transform: translateX(var(--snow-x-end)) translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(styleElement)
  }

  /**
   * Remove CSS styles
   */
  const removeStyles = () => {
    if (styleElement) {
      styleElement.remove()
      styleElement = null
    }
  }

  /**
   * Generate random number between min and max
   */
  const random = (min, max) => Math.random() * (max - min) + min

  /**
   * Generate random integer between min and max (inclusive)
   */
  const randomInt = (min, max) => Math.floor(random(min, max + 1))

  /**
   * Create a single snowflake element
   * @returns {HTMLElement|null}
   */
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
    snowflake.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 50 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.2911 35.3845L50 39.8113L48.2293 42.8628L40.4446 38.3917L42.4879 45.9679L39.0858 46.8756L36.4208 36.9513L36.1578 35.9111L26.8388 30.5397V41.3708L27.522 42.0754L34.8573 49.3969L32.3809 51.8771L26.8388 46.3317V55H23.3558V46.2429L17.7319 51.7892L15.1906 49.309L22.5264 42.0443L23.3558 41.2825V30.5397L13.9388 35.9111L13.5949 36.9513L10.9216 46.8756L7.51561 45.9679L9.55669 38.3917L1.77114 42.8628L0 39.8113L7.70849 35.3845L0.0914308 33.3543L1.004 29.9663L11.0592 32.6462L12.0271 32.9043L21.4575 27.4887L12.1041 22.1174L11.0583 22.3963L1.08106 25.0553L0.168494 21.6674L7.78555 19.6372L0.000870706 15.1657L1.77289 12.1143L9.48355 16.5411L7.44682 8.965L10.8611 8.05728L13.5705 18.0591L13.8618 19.0218L23.3558 24.4373V13.6946L22.5425 12.9332L15.191 5.66803L17.7162 3.18783L23.3558 8.73417V0H26.8388V8.64539L32.3891 3.09906L34.8569 5.57925L27.5133 12.9012L26.8388 13.6062V24.4373L36.2349 19.0218L36.46 18.0591L39.1541 8.05728L42.5602 8.965L40.5191 16.5411L48.2276 12.1143L49.9987 15.1657L42.2131 19.6367L49.8298 21.667L48.9172 25.0549L38.9399 22.3958L37.8941  22.1169L28.5416 27.4883L37.9716 32.9043L38.9395 32.6462L48.9947 29.9663L49.9073 33.3543L42.2911 35.3845Z" fill="${color}"/>
      </svg>
    `

    snowflake.addEventListener('animationend', () => {
      removeSnowflake(snowflake)
    }, { once: true })

    containerEl.appendChild(snowflake)
    activeFlakes.add(snowflake)

    return snowflake
  }

  /**
   * Remove a single snowflake
   */
  const removeSnowflake = (flake) => {
    if (flake && flake.parentNode) {
      flake.remove()
      activeFlakes.delete(flake)
    }
  }

  /**
   * Cleanup snowflakes periodically (less frequent)
   */
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

  /**
   * Remove all snowflakes
   */
  const removeAllSnowflakes = () => {
    activeFlakes.forEach(removeSnowflake)
    activeFlakes.clear()
  }

  /**
   * Start the snowfall animation
   */
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
    
    flakeIntervalId = setInterval(() => {
      createSnowflake()
    }, interval)

    // Cleanup less frequently for better performance
    cleanupIntervalId = setInterval(cleanupSnowflakes, 2000)
  }

  /**
   * Stop the snowfall animation
   */
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
