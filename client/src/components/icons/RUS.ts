import { defineComponent, h } from 'vue'

const RUS = defineComponent({
  name: 'RUS',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 3 2',
        width: '24',
        height: '16',
      },
      [
        h('rect', { x: '0', y: '0', width: '3', height: '0.6667', fill: '#fff' }),
        h('rect', { x: '0', y: '0.6667', width: '3', height: '0.6667', fill: '#0039A6' }),
        h('rect', { x: '0', y: '1.333', width: '3', height: '0.6667', fill: '#D52B1E' }),
      ],
    )
  },
})

export default RUS
