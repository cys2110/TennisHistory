import { defineComponent, h } from 'vue'

const CRC = defineComponent({
  name: 'CRC',
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
        h('path', { fill: '#002B7F', d: 'M.102.153h85.04v56.693H.1z' }),
        h('path', { fill: '#FFF', d: 'M.102 9.495h85.04v38.012H.1z' }),
        h('path', { fill: '#CE1126', d: 'M.102 19.374h85.04v18.254H.1z' }),
      ],
    )
  },
})

export default CRC
