import { defineComponent, h } from 'vue'

const RSA = defineComponent({
  name: 'RSA',
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
        h('path', { fill: '#FFF', d: 'M-.02.155h85.04v56.693H-.02z' }),
        h('path', { fill: '#0033A0', d: 'm44.658 38.562-27.4 18.285H85.02V38.562' }),
        h('path', { fill: '#FF0000', d: 'M17.258.155 44.66 18.44h40.36V.155' }),
        h('path', {
          fill: '#007A4D',
          d: 'M85.02 21.38H43.955L12.148.153H-.018v56.692h12.17l31.803-21.223H85.02',
        }),
        h('path', { fill: '#FFB612', d: 'M-.016 48.694 29.746 28.5-.018 8.3' }),
        h('path', { fill: '#000000', d: 'M-.016 44.85 24.078 28.5-.018 12.15' }),
      ],
    )
  },
})

export default RSA
