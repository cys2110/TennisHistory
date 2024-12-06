import { defineComponent, h } from 'vue'

const NOR = defineComponent({
  name: 'NOR',
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
        h('path', { fill: '#BA0C2F', d: 'M-.02.154h85.04v56.69H-.02z' }),
        h('path', {
          fill: '#FFF',
          d: 'M85.02 21.156H35.64V.154H20.953v21.002H-.02V36.13h20.972v20.716h14.69V36.13H85.02',
        }),
        h('path', {
          fill: '#00205B',
          d: 'M31.955.154h-7.318V24.84H-.02v7.603h24.657v24.403h7.318V32.443h52.927V24.84H31.955',
        }),
      ],
    )
  },
})

export default NOR
