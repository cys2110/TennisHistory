import { defineComponent, h } from 'vue'

const NZL = defineComponent({
  name: 'NZL',
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
        h('path', { d: 'M-.02.153h85.04v56.693H-.02z', fill: '#00247D' }),
        h('path', {
          d: 'M42.5.153h-5.69L25.392 7.907V.153h-8.468v7.752L5.514.153H-.02V3.49l9.01 6.122H-.02v9.432h9.005L-.02 25.157V28.5h5.525l11.42-7.753V28.5h8.467v-7.75l11.41 7.75h5.7v-3.22l-9.18-6.234h9.18V9.612h-9.173l9.17-6.226',
          fill: '#fff',
        }),
        h('path', {
          d: 'M14.165 9.612.243.152H-.02v2.002l10.976 7.458m17.27 0L42.418.152h-3.252l-14.193 9.46m-1.203 1.784V.153h-5.065v11.242H-.02s.01 5.578.024 5.64l18.7.013V28.5h5.063V17.037H42.5v-5.64H23.77zm4.083 7.437L42.085 28.5h.416v-1.897l-11.44-7.77m-16.731 0-14.35 9.56v.108h3.096l14.51-9.667',
          fill: '#CC142B',
        }),
        h('path', {
          fill: '#FFF',
          d: 'm63.562 6.99 1.045 3.09h3.385l-2.744 2.007 1.015 3.06-2.7-1.818-2.702 1.817 1.018-3.06-2.723-2.008h3.386',
        }),
        h('path', {
          fill: '#CC142B',
          d: 'm62.48 11.896-1.773-1.307h2.203l.657-1.99.674 1.99h2.19l-1.784 1.304.662 1.996-1.745-1.176-1.747 1.176',
        }),
        h('path', {
          fill: '#FFF',
          d: 'm74.81 17.24.937 2.767h3.03l-2.456 1.797.91 2.74-2.417-1.63-2.42 1.63.91-2.74-2.438-1.797h3.03',
        }),
        h('path', {
          d: 'm73.842 21.632-1.587-1.168h1.973l.587-1.78.605 1.78h1.96l-1.6 1.168.593 1.785-1.56-1.053-1.564 1.053',
          fill: '#CC142B',
        }),
        h('path', {
          d: 'm50.47 20.306 1.017 3.006h3.294l-2.67 1.953.99 2.98-2.628-1.77-2.63 1.77.988-2.98-2.65-1.953h3.296',
          fill: '#FFF',
        }),
        h('path', {
          d: 'm49.416 25.08-1.725-1.272h2.145l.64-1.936.657 1.936h2.13l-1.738 1.27.644 1.943-1.696-1.144-1.7 1.145',
          fill: '#CC142B',
        }),
        h('path', {
          d: 'm63.653 40.544 1.158 3.412h3.74l-3.033 2.22 1.123 3.382-2.985-2.01-2.986 2.01 1.12-3.383-3.007-2.22h3.743',
          fill: '#FFF',
        }),
        h('path', {
          d: 'm62.495 45.956-1.817-1.34h2.25l.67-2.026.688 2.026h2.238l-1.83 1.338.678 2.028-1.79-1.207-1.792 1.207',
          fill: '#CC142B',
        }),
      ],
    )
  },
})

export default NZL
