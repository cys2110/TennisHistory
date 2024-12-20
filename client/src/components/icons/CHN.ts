import { defineComponent, h } from 'vue'

const CHN = defineComponent({
  name: 'CHN',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 85 57',
        width: '85',
        height: '57',
      },
      [
        h('path', { fill: '#FF0000', d: 'M-.02.154h85.04v56.69H-.02z' }),
        h('path', {
          fill: '#FFDE00',
          d: 'm14.33 6.242 1.928 5.696h6.244l-5.06 3.705 1.872 5.648-4.98-3.358-4.984 3.36 1.87-5.65L6.2 11.94h6.245m21.92 5.66.625 1.845h2.022l-1.64 1.2.607 1.832-1.615-1.086-1.615 1.087.607-1.83-1.625-1.202h2.022M33.008 9.19l1.38 1.376 1.81-.896-.934 1.8 1.353 1.372-1.926-.258-.965 1.69-.266-1.91-1.993-.356 1.814-.893m-6.873-6.752 1.832.666 1.264-1.58-.086 2.03 1.805.668-1.854.582-.16 1.938-1.05-1.613-1.955.52 1.264-1.58m-1.06 18.408 1.832.666 1.264-1.58-.086 2.03 1.805.67-1.854.582-.16 1.94-1.05-1.618-1.955.52 1.264-1.58',
        }),
      ],
    )
  },
})

export default CHN
