import { defineComponent, h } from 'vue'

const SCG = defineComponent({
  name: 'SCG',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 1200 600',
        width: '1200',
        height: '600',
      },
      [
        h('path', { d: 'M0 0h1200v600H0', fill: '#C8102E' }),
        h('path', { d: 'M0 0h1200v400H0', fill: '#fff' }),
        h('path', { d: 'M0 0h1200v200H0', fill: '#003893' }),
      ],
    )
  },
})

export default SCG
