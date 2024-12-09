export function useSnowfall() {
  let flakeIntervalId = null
  let styleElement = null

  const addStyles = () => {
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.textContent = `
        .flake {
          position: absolute;
          top: -20px;
          z-index: 999;
          width: 30px;
          height: 30px;
          pointer-events: none;
        }
        @keyframes falling {
          0% { transform: translateX(0) translateY(0) rotate(0deg); opacity: 1; }
          12.5% { transform: translateX(-15px) translateY(12.5vh) rotate(45deg); opacity: 1; }
          25% { transform: translateX(15px) translateY(25vh) rotate(90deg); opacity: 1; }
          37.5% { transform: translateX(-20px) translateY(37.5vh) rotate(135deg); opacity: 0.9; }
          50% { transform: translateX(20px) translateY(50vh) rotate(180deg); opacity: 0.9; }
          62.5% { transform: translateX(-15px) translateY(62.5vh) rotate(225deg); opacity: 0.8; }
          75% { transform: translateX(15px) translateY(75vh) rotate(270deg); opacity: 0.7; }
          87.5% { transform: translateX(-10px) translateY(87.5vh) rotate(315deg); opacity: 0.6; }
          100% { transform: translateX(0) translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `
      document.head.appendChild(styleElement)
    }
  }

  const removeStyles = () => {
    if (styleElement) {
      document.head.removeChild(styleElement)
      styleElement = null
    }
  }

  const htmlToElement = (html) => {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild
  }

  const createSnowflake = () => {
    const flakeSVG = `
      <svg width="100%" height="100%" viewBox="0 0 50 55" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.2911 35.3845L50 39.8113L48.2293 42.8628L40.4446 38.3917L42.4879 45.9679L39.0858 46.8756L36.4208 36.9513L36.1578 35.9111L26.8388 30.5397V41.3708L27.522 42.0754L34.8573 49.3969L32.3809 51.8771L26.8388 46.3317V55H23.3558V46.2429L17.7319 51.7892L15.1906 49.309L22.5264 42.0443L23.3558 41.2825V30.5397L13.9388 35.9111L13.5949 36.9513L10.9216 46.8756L7.51561 45.9679L9.55669 38.3917L1.77114 42.8628L0 39.8113L7.70849 35.3845L0.0914308 33.3543L1.004 29.9663L11.0592 32.6462L12.0271 32.9043L21.4575 27.4887L12.1041 22.1174L11.0583 22.3963L1.08106 25.0553L0.168494 21.6674L7.78555 19.6372L0.000870706 15.1657L1.77289 12.1143L9.48355 16.5411L7.44682 8.965L10.8611 8.05728L13.5705 18.0591L13.8618 19.0218L23.3558 24.4373V13.6946L22.5425 12.9332L15.191 5.66803L17.7162 3.18783L23.3558 8.73417V0H26.8388V8.64539L32.3891 3.09906L34.8569 5.57925L27.5133 12.9012L26.8388 13.6062V24.4373L36.2349 19.0218L36.46 18.0591L39.1541 8.05728L42.5602 8.965L40.5191 16.5411L48.2276 12.1143L49.9987 15.1657L42.2131 19.6367L49.8298 21.667L48.9172 25.0549L38.9399 22.3958L37.8941  22.1169L28.5416 27.4883L37.9716 32.9043L38.9395 32.6462L48.9947 29.9663L49.9073 33.3543L42.2911 35.3845Z" fill="#fff"/>
      </svg>`
    const fallingTime = Math.floor(Math.random() * 10) + 20
    const flakePos = Math.floor(Math.random() * 90) + 4
    const flakeSize = (Math.floor(Math.random() * 100) + 10) / 100
    const snowflake = htmlToElement(
      `<div 
        class='flake' 
        style='
          left:${flakePos}%; 
          transform:scale(${flakeSize}); 
          animation:falling ${fallingTime}s linear infinite;'
      >
        ${flakeSVG}
      </div>`,
    )
    document.body.appendChild(snowflake)
  }

  const removeSnowflakes = (params) => {
    const flakes = document.querySelectorAll('.flake')
    flakes.forEach((el) => {
      const flakeRect = el.getBoundingClientRect()
      const bodyHeight = window.innerHeight
      if (flakeRect.bottom > bodyHeight || params === 'all') {
        el.remove()
      }
    })
  }

  const startSnowflakes = () => {
    addStyles()
    flakeIntervalId = setInterval(() => {
      createSnowflake()
      removeSnowflakes()
    }, 500)
  }

  const stopSnowflakes = () => {
    clearInterval(flakeIntervalId)
    removeSnowflakes('all')
    removeStyles()
  }

  return {
    startSnowflakes,
    stopSnowflakes,
  }
}
