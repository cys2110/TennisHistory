import { defineComponent, h } from 'vue'

const FIN = defineComponent({
  name: 'FIN',
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
        h('path', { fill: '#FFF', d: 'M.102.154h85.04v56.69H.1z' }),
        h('path', {
          fill: '#003580',
          d: 'M85.14 20.54H40.9V.153H25.69V20.54H.103v15.923H25.69v20.383h15.208V36.463H85.14',
        }),
      ],
    )
  },
})

export default FIN
