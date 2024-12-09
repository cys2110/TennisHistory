import { defineComponent, h } from 'vue'

const KOR = defineComponent({
  name: 'KOR',
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
        h('path', { fill: '#FFF', d: 'M-.02.154h85.04v56.692H-.02z' }),
        h('path', {
          fill: '#000000',
          d: 'm20.937 5.62 1.923 1.277-7.843 11.817-1.923-1.276zm2.953 1.966 1.92 1.278-7.854 11.81-1.922-1.278zm2.95 1.964 1.924 1.28-7.862 11.81-1.923-1.28zm33.114 31.26 1.923 1.277-3.61 5.43-1.922-1.28zm4.254-6.38 1.922 1.28-3.618 5.428-1.922-1.28zm-1.514 8.203 1.92 1.28-3.618 5.425-1.92-1.28zm4.243-6.385 1.922 1.28-3.614 5.426-1.922-1.28zm-1.513 8.202 1.924 1.28-3.607 5.43-1.923-1.28zm4.249-6.38 1.922 1.28-3.612 5.427-1.922-1.28zm-8.811-20.885 1.928-1.27 3.582 5.447-1.93 1.268zm-4.214-6.405 1.928-1.27 3.583 5.45-1.93 1.268zm2.744-1.806 1.928-1.27 7.802 11.848-1.928 1.27zm6.965 4.596 1.928-1.27 3.584 5.448-1.93 1.27zM62.14 7.165l1.93-1.268 3.58 5.448-1.93 1.268zM13.164 39.39l1.928-1.267 7.796 11.853-1.928 1.268zm5.49-3.61 1.93-1.27 7.798 11.85-1.928 1.268zm1.469 8.21 1.928-1.27 3.586 5.445-1.93 1.27zm-4.215-6.406 1.93-1.27 3.584 5.447-1.93 1.27z',
        }),
        h('circle', { fill: '#003478', cx: '42.555', cy: '28.522', r: '14.199' }),
        h('path', {
          fill: '#CD2E3A',
          d: 'M56.754 28.522c0-7.842-6.357-14.2-14.2-14.2-5.348 0-10 2.962-12.422 7.33-3.165 8.113 7.265 13.98 12.393 6.925 5.27-7.16 15.554-1.212 12.4 6.903a14.117 14.117 0 0 0 1.83-6.958z',
        }),
      ],
    )
  },
})

export default KOR