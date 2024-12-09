# Snowfall Effect in Vue.js
This repository provides a simple and customizable snowfall effect for your web applications using Vue.js. The useSnowfall function allows you to easily add and control falling snowflakes on your webpage.

## Table of Contents
- [Snowfall Effect in Vue.js](#snowfall-effect-in-vuejs)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Customization](#customization)
  - [License](#license)

## Installation
To use the snowfall effect, you can simply copy the useSnowfall function into your Vue.js project. Ensure you have Vue.js installed in your project.

```bash
npm install vue-snowfall
```

## Usage
1. Import the useSnowfall function in your Vue component:

```javascript
import { useSnowfall } from 'vue-snowfall'
```
2. Initialize the snowfall effect in your component's setup function:

```javascript
export default {
  setup() {
    const { startSnowflakes, stopSnowflakes } = useSnowfall()

    // Start snowfall when the component is mounted
    onMounted(() => {
      startSnowflakes()
    })

    // Stop snowfall when the component is unmounted
    onBeforeUnmount(() => {
      stopSnowflakes('all')
    })
  }
}
```

3. Add styles to your component if needed, or let the useSnowfall function handle it.

## Customization
You can customize the snowfall effect by modifying the following parameters in the `useSnowfall` function:

**Falling Time**: Adjust the duration of the falling animation by changing the `fallingTime` variable in the `createSnowflake` function.
**Flake Size**: Modify the size of the snowflakes by changing the calculation of `flakeSize`.
**Animation Styles**: Customize the CSS styles in the `addStyles` function to change the appearance of the snowflakes.
Example of Customization
To change the falling speed and size of the snowflakes, you can modify the createSnowflake function like this:

```javascript
const fallingTime = Math.floor(Math.random() * 5) + 5; // Faster falling speed
const flakeSize = (Math.floor(Math.random() * 50) + 50) / 100; // Larger snowflakes
```

## License
This project is licensed under the MIT License. Feel free to use and modify it as per your needs.

---
Enjoy the beautiful snowfall effect on your web applications! If you have any questions or suggestions, feel free to open an issue in this repository.
