import { defineComponent, h } from 'vue'

const CHI = defineComponent({
  name: 'CHI',
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
        h('path', { fill: '#D52B1E', d: 'M.035 28.502h84.93v28.345H.035z' }),
        h('path', {
          fill: '#FFF',
          d: 'M.035.156h84.93v28.346H.035z',
        }),
        h('path', { fill: '#0033A0', d: 'M.035.153H28.38V28.5H.036z' }),
        h('path', {
          fill: '#FFF',
          d: 'm14.176 7.948 1.646 4.82 5.29-.017-4.28 3.154 1.602 4.776-4.227-2.828-4.21 2.854 1.57-4.787-4.264-3.127 5.29-.015',
        }),
      ],
    )
  },
})

export default CHI
