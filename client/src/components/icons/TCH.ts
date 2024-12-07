import { defineComponent, h } from 'vue'

const TCH = defineComponent({
  name: 'TCH',
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
        h('path', { fill: '#D7141A', d: 'M.064 28.502H85.1v28.344H.065z' }),
        h('path', { fill: '#FFF', d: 'M.064.154H85.1v28.348H.065z' }),
        h('path', { fill: '#11457E', d: 'M47.46 28.502.065 56.846V.154' }),
      ],
    )
  },
})

export default TCH
