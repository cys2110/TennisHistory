import { defineComponent, h } from 'vue'

const JPN = defineComponent({
  name: 'JPN',
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
        h('rect', { x: '0', y: '0', width: '3', height: '2', fill: '#fff' }),
        h('circle', { r: '0.6', cx: '1.5', cy: '1', fill: '#BC002D' }),
      ],
    )
  },
})

export default JPN
