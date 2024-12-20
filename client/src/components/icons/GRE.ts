import { defineComponent, h } from 'vue'

const GRE = defineComponent({
  name: 'GRE',
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
        h('path', { fill: '#FFF', d: 'M.02.154h84.96v56.692H.02z' }),
        h('path', {
          fill: '#0D5EAF',
          d: 'M31.38 6.378v6.393H18.81V.155h66.17V6.38h-53.6zm53.6 12.618V12.77h-53.6v6.226h53.6zM.02 44.23h84.96v-6.227H.02v6.227zm0 12.616h84.96V50.62H.02v6.226zm12.567-37.85H.02v12.618h12.567V18.996zm0-18.842H.02V12.77h12.567V.155zm6.225 31.46H84.98v-6.226h-53.6v-6.393H18.81v12.618z',
        }),
      ],
    )
  },
})

export default GRE
