import { defineComponent, h } from 'vue'

const LAT = defineComponent({
  name: 'LAT',
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
        h('path', { fill: '#FFF', d: 'M-.02 22.3h85.04v12.405H-.02z' }),
        h('path', {
          fill: '#9E1B34',
          d: 'M-.02 34.705h85.04v22.14H-.02zm0-34.551h85.04V22.3H-.02z',
        }),
      ],
    )
  },
})

export default LAT
