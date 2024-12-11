import { defineComponent, h } from 'vue'

const FRA = defineComponent({
  name: 'FRA',
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
        h('rect', { x: '0', y: '0', width: '1', height: '2', fill: '#0055A4' }),
        h('rect', { x: '1', y: '0', width: '1', height: '2', fill: '#fff' }),
        h('rect', { x: '2', y: '0', width: '1', height: '2', fill: '#EF4135' }),
      ],
    )
  },
})

export default FRA
