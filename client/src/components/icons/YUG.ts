import { defineComponent, h } from 'vue'

const YUG = defineComponent({
  name: 'YUG',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 1000 500',
        width: '1000',
        height: '500',
      },
      [
        h('path', { fill: '#003893', d: 'M0 0h1000v500H0z' }),
        h('path', { fill: '#fff', d: 'M0 166.667h1000V500H0z' }),
        h('g', { fill: '#de0000' }, [
          h('path', { d: 'M0 333.333h1000V500H0z' }),
          h('path', {
            'fill-rule': 'evenodd',
            stroke: '#fcd115',
            'stroke-width': '8.89',
            d: 'm500 97.716 34.193 105.222 110.638.005-89.506 65.035 34.185 105.225-89.51-65.03-89.511 65.029 34.185-105.225-89.506-65.035 110.638-.005z',
          }),
        ]),
      ],
    )
  },
})

export default YUG
