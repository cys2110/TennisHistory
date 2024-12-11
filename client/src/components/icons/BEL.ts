import { defineComponent, h } from 'vue'

const BEL = defineComponent({
  name: 'BEL',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 15 13',
        width: '15',
        height: '13',
      },
      [
        h('rect', { x: '0', y: '0', width: '15', height: '13', fill: '#1E429B' }),
        h('rect', { x: '0', y: '0', width: '5', height: '13', fill: '#000000' }),
        h('rect', { x: '5', y: '0', width: '5', height: '13', fill: '#FFD100' }),
        h('rect', { x: '10', y: '0', width: '5', height: '13', fill: '#EF3340' }),
      ],
    )
  },
})

export default BEL
