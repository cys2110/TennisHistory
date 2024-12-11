import { defineComponent, h } from 'vue'

const LTU = defineComponent({
  name: 'LTU',
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
        h('rect', { x: '0', y: '0', width: '3', height: '0.6667', fill: '#FDB913' }),
        h('rect', { x: '0', y: '0.6667', width: '3', height: '0.6667', fill: '#007A33' }),
        h('rect', { x: '0', y: '1.333', width: '3', height: '0.6667', fill: '#C1272D' }),
      ],
    )
  },
})

export default LTU
