import { defineComponent, h } from 'vue'

const MON = defineComponent({
  name: 'MON',
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
        h('rect', { x: '0', y: '0', width: '3', height: '1', fill: '#CE1126' }),
        h('rect', { x: '0', y: '1', width: '3', height: '1', fill: '#fff' }),
      ],
    )
  },
})

export default MON
