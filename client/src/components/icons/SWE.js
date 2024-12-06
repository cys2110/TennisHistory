import { defineComponent, h } from 'vue'

const SWE = defineComponent({
  name: 'SWE',
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
        h('rect', { x: '0', y: '0', width: '3', height: '2', fill: '#005BAC' }),
        h('rect', { x: '0.9', y: '0', width: '0.25', height: '2', fill: '#FECB00' }),
        h('rect', { x: '0', y: '0.875', width: '3', height: '0.25', fill: '#FECB00' }),
      ],
    )
  },
})

export default SWE
