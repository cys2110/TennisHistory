import { defineComponent, h } from 'vue'

const GEO = defineComponent({
  name: 'GEO',
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
        h('path', { fill: '#FFF', d: 'M-.02.153h85.04v56.693H-.02z' }),
        h('path', {
          fill: '#D50000',
          d: 'M23.652 11.39c0-1.444.275-2.458.275-2.458s-2.134.788-4.21.998c.2-1.987.998-4.213.998-4.213s-1.016.277-2.46.277l-2.456-.277s.788 2.137.997 4.213c-2.076-.21-4.21-.998-4.21-.998s.274 1.014.274 2.457l-.274 2.457s2.225-.796 4.21-.998c-.208 2.074-.997 4.21-.997 4.21s1.013-.276 2.456-.276l2.46.277s-.798-2.224-1-4.21c1.987.2 4.212.997 4.212.997s-.276-1.015-.276-2.458zm0 34.364c0-1.443.275-2.457.275-2.457s-2.135.787-4.21.998c.2-1.988.997-4.213.997-4.213s-1.016.277-2.46.277l-2.456-.278s.79 2.137.998 4.213c-2.076-.21-4.21-.998-4.21-.998s.274 1.014.274 2.457l-.275 2.457s2.225-.795 4.21-.997c-.208 2.076-.997 4.213-.997 4.213s1.014-.277 2.457-.277l2.46.276s-.798-2.225-1-4.213c1.987.202 4.212.998 4.212.998s-.275-1.013-.275-2.456zM72.154 11.39c0-1.444.277-2.458.277-2.458s-2.135.788-4.21.998c.2-1.987.997-4.213.997-4.213s-1.014.277-2.457.277l-2.457-.277s.787 2.137.998 4.213c-2.075-.21-4.212-.998-4.212-.998s.277 1.014.277 2.457l-.277 2.457s2.227-.796 4.213-.998c-.21 2.074-.997 4.21-.997 4.21s1.014-.276 2.457-.276l2.457.277s-.795-2.224-.998-4.21c1.985.2 4.212.997 4.212.997s-.278-1.015-.278-2.458zm0 34.364c0-1.443.277-2.457.277-2.457s-2.136.787-4.212.998c.2-1.988.998-4.213.998-4.213s-1.014.277-2.457.277l-2.458-.278s.787 2.137.998 4.213c-2.076-.21-4.213-.998-4.213-.998s.277 1.014.277 2.457l-.277 2.457s2.227-.795 4.213-.997c-.21 2.076-.998 4.213-.998 4.213s1.014-.277 2.457-.277l2.456.276s-.795-2.225-.998-4.213c1.986.202 4.213.998 4.213.998s-.276-1.013-.276-2.456zM85.02 22.83H48.17V.155H36.832V22.83H-.02v11.34h36.852v22.677H48.17V34.17h36.85',
        }),
      ],
    )
  },
})

export default GEO