import { defineComponent, h } from 'vue'

const JAM = defineComponent({
  name: 'JAM',
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
        h('path', { fill: '#FFD100', d: 'M85.02 56.795H-.02V.206h85.04' }),
        h('path', {
          fill: '#000000',
          d: 'M35.108 28.33-.02 51.91V5.088M49.893 28.67 85.02 5.088V51.91',
        }),
        h('path', {
          fill: '#007847',
          d: 'M42.5 23.417 77.322.207H7.366m34.822 33.377L7.366 56.794h69.956',
        }),
      ],
    )
  },
})

export default JAM
