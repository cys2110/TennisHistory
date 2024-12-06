import { defineComponent, h } from 'vue'

const COL = defineComponent({
  name: 'COL',
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
        h('path', { fill: '#CE1126', d: 'M-.02 42.522h85.04v14.324H-.02z' }),
        h('path', { fill: '#0033A0', d: 'M-.02 28.196h85.04v14.326H-.02z' }),
        h('path', { fill: '#FFD100', d: 'M-.02.153h85.04v28.043H-.02z' }),
      ],
    )
  },
})

export default COL
