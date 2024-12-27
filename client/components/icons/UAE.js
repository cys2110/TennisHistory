import { defineComponent, h } from 'vue'

const UAE = defineComponent({
  name: 'UAE',
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
        h('path', { fill: '#FFF', d: 'M-.016 19.207h85.03v18.896H-.015z' }),
        h('path', {
          fill: '#007A33',
          d: 'M-.016.31h85.03v18.897H-.015z',
        }),
        h('path', { fill: '#101820', d: 'M-.016 38.104h85.03V57H-.015z' }),
        h('path', {
          fill: '#C8102E',
          d: 'M-.016.307H22.01V57H-.016z',
        }),
      ],
    )
  },
})

export default UAE
