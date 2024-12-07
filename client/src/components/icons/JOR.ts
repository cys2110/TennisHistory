import { defineComponent, h } from 'vue'

const JOR = defineComponent({
  name: 'JOR',
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
        h('path', { fill: '#007A33', d: 'M-.02 38.562h85.04v18.285H-.02z' }),
        h('path', { fill: '#000000', d: 'M-.02.155h85.04V18.44H-.02z' }),
        h('path', { fill: '#FFF', d: 'M-.02 18.44h85.04v20.12H-.02z' }),
        h('path', { fill: '#CE1126', d: 'M47.378 28.5-.02 56.848V.153' }),
        h('path', {
          fill: '#FFF',
          d: 'm24.343 24.2.842 2.13 2.187-.673-1.14 1.985 1.89 1.295-2.264.345.166 2.28-1.68-1.55-1.68 1.55.166-2.28-2.265-.345 1.89-1.295-1.14-1.985 2.188.672',
        }),
      ],
    )
  },
})

export default JOR
