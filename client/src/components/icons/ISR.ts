import { defineComponent, h } from 'vue'

const ISR = defineComponent({
  name: 'ISR',
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
        h('path', { fill: '#FFF', d: 'M-.02.153h85.038v56.694H-.02z' }),
        h('path', {
          fill: '#0038B8',
          d: 'M-.02 5.646h85.038v8.406H-.02zm0 37.172h85.038v8.408H-.02zm47.833-17.29L42.5 16.325l-5.315 9.203-5.314 9.206H53.13l-5.315-9.206zm-12.75 7.363L42.5 20.01l7.437 12.88H35.063zm2.123-1.385L42.5 40.71l5.313-9.204 5.314-9.204H31.87l5.316 9.204zm12.75-7.362L42.5 37.026l-7.437-12.882h14.874z',
        }),
      ],
    )
  },
})

export default ISR
