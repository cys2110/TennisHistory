import { defineComponent, h } from 'vue'

const UKR = defineComponent({
  name: 'UKR',
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
        h('rect', { x: '0', y: '0', width: '3', height: '1', fill: '#0057B7' }),
        h('rect', { x: '0', y: '1', width: '3', height: '1', fill: '#FFD700' }),
      ],
    )
  },
})

export default UKR
