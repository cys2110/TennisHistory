import { defineComponent, h } from 'vue'

const SUI = defineComponent({
  name: 'SUI',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 1 1',
        width: '16',
        height: '16',
      },
      [
        h('rect', { x: '0', y: '0', width: '1', height: '1', fill: '#FF0000' }),
        h('rect', { x: '0.375', y: '0.125', width: '0.25', height: '0.75', fill: '#fff' }),
        h('rect', { x: '0.125', y: '0.375', width: '0.75', height: '0.25', fill: '#fff' }),
      ],
    )
  },
})

export default SUI
