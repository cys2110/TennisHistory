import { defineComponent, h } from 'vue'

const SEN = defineComponent({
  name: 'SEN',
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
        h('path', { fill: '#00853F', d: 'M-.02.153h28.347v56.693H-.02z' }),
        h('path', { fill: '#FDEF42', d: 'M28.327.153h28.347v56.693H28.327z' }),
        h('path', { fill: '#E31B23', d: 'M56.674.153H85.02v56.693H56.674z' }),
        h('path', {
          fill: '#00853F',
          d: 'm42.48 19.114 2.05 6.06h6.642l-5.387 3.942 1.994 6.006-5.298-3.57-5.3 3.57 1.99-6.006-5.343-3.943h6.644',
        }),
      ],
    )
  },
})

export default SEN
