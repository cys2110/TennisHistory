import { defineComponent, h } from 'vue'

const BLR = defineComponent({
  name: 'BLR',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 1200 600',
        width: '378',
        height: '189',
      },
      [
        h('defs', {}, [
          h('clipPath', { id: 'p' }, [h('path', { d: 'm0 0h200v608h8v284l-8 8H0z' })]),
        ]),
        h('path', { fill: '#C8313E', d: 'm0 0h378v189H0z' }),
        h('g', { transform: 'matrix(.21,0,0,.21,2,0)', 'clip-path': 'url(#p)', fill: '#fff' }, [
          h('g', { id: 'b' }, [
            h('path', {
              id: 'a',
              d: 'm36 0v14h-9v14H16v16H8v13H-8V24H8V6H-8V0zm26 77v15h-8v12h-8V92h-8V77h-8V57h8V42h8V30h8v12h8v15h8v20zm-17-1h10V58H45zM19 183h8v-18h-8zm54 0h8v-18h-8zM-8 305H6v13h6v16h9v15h12v-15h9v-16h8v-13H38v-15h21v10h13v17h11v19h-8v14h-7v13h-6v14h-9v12h-7v11h-9v14H24v-15h-9v-14H8v-9H-8v-23H8v-20H-8z',
            }),
            h('use', { 'xlink:href': '#a', transform: 'matrix(-1,0,0,1,200,0)' }),
            h('path', {
              d: 'm96 0v32h8V0h32v14h-8v14h-12v16h-8v13H92V44h-8V28H72V14h-8V0zm-2 274v-11h-6v-13h-7v-14h-8v-14h-8v-10h-9v-14H44v14h-9v10h-7v14h-8v14h-6v13H8v17H-8v-44H8v-20H-8v-33H8v14h10v14h10v-14h10v-14h8v-18h-8v-14H28v-14H18v14H8v14H-8v-41H8v-19H-8V77H8v13h8v16h11v13h9v15h7v12h14v-12h7v-15h9v-13h11V90h8V77h16v13h8v16h11v13h9v15h7v12h14v-12h7v-15h9v-13h11V90h8V77h16v28h-16v19h16v41h-16v-14h-10v-14h-10v14h-10v14h-8v18h8v14h10v14h10v-14h10v-14h16v33h-16v20h16v44h-16v-17h-6v-13h-6v-14h-8v-14h-7v-10h-9v-14h-12v14h-9v10h-8v14h-8v14h-7v13h-6v11zm2-167v27h8v-27zm-4 58v-14H82v-14H72v14H62v14h-8v18h8v14h10v14h10v-14h10v-14h16v14h10v14h10v-14h10v-14h8v-18h-8v-14h-10v-14h-10v14h-10v14zm4 46v27h8v-27z',
            }),
          ]),
          h('use', { 'xlink:href': '#b', transform: 'matrix(1,0,0,-1,0,900)' }),
          h('path', {
            d: 'm-8 408H8v14h7v8h8v14h7v12h-7v14h-8v8H8v14H-8zm216 0v84h-16v-14h-7v-8h-8v-14h-7v-12h7v-14h8v-8h7v-14zM62 459h8v-18h-8zm76 0v-18h-8v18zm-42-59h8v-18h-8zm0 100v18h8v-18zm-50-75h14v-11h10v-10h5v-10h6v-14h8v-14h4v-13h14v13h4v14h8v14h6v10h5v10h10v11h14v50h-14v11h-10v10h-5v10h-6v14h-8v14h-4v13H93v-13h-4v-14h-8v-14h-6v-10h-5v-10H60v-11H46zm50 9v-15h-8v-10h-8v25h8v9h5v14h-5v9h-8v25h8v-10h8v-15h8v15h8v10h8v-25h-8v-9h-5v-14h5v-9h8v-25h-8v10h-8v15z',
          }),
        ]),
        h('path', { fill: '#4AA657', d: 'm44 126h334v63H44z' }),
      ],
    )
  },
})

export default BLR