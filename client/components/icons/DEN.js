import { defineComponent, h } from 'vue'

const DEN = defineComponent({
  name: 'DEN',
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
        h('path', { fill: '#C60C30', d: 'M-.02.308h85.04V57H-.02z' }),
        h('path', {
          fill: '#FFF',
          d: 'M31.955.308H24.07v24.686H-.02v7.887h24.09V57h7.885V32.88h52.927v-7.886H31.955',
        }),
      ],
    )
  },
})

export default DEN
