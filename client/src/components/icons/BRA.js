import { defineComponent, h } from 'vue'

const BRA = defineComponent({
  name: 'BRA',
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
        h('path', {
          fill: '#009739',
          d: 'M-.02.058h85.04V56.75H-.02z',
        }),
        h('path', { fill: '#FFCC29', d: 'M8.898 28.364 42.57 6.856l33.532 21.508L42.57 49.952' }),
        h('circle', {
          stroke: '#29ABE2',
          'stroke-width': '.028',
          cx: '42.5',
          cy: '28.403',
          r: '14.174',
          fill: 'none',
        }),
        h('circle', { fill: '#002776', cx: '42.5', cy: '28.403', r: '14.174' }),
        h('path', {
          d: 'm30.953 25.26.125.387h.406l-.33.237.127.387-.327-.24-.328.24.126-.386-.33-.238h.41m11.708 8.51.126.39.406-.003-.33.238.127.387-.33-.24-.328.24.127-.388-.33-.238.406.002m-5.547.761.125.386.406-.002-.33.24.127.385-.328-.24-.328.24.126-.386-.33-.24.406.002m-1.971-1.483.083.258.27-.002-.22.158.085.258-.22-.16-.216.16.084-.258-.22-.158.27.002m6.448-2.971.084.258h.27l-.22.156.085.257-.22-.16-.216.16.084-.258-.217-.157h.27m5.389-4.477.084.258h.27l-.22.156.083.258-.217-.16-.218.16.086-.258-.22-.156h.27M41.855 32.6l.053.163.168-.002-.137.098.05.163-.135-.1-.137.1.055-.162-.14-.097.17.003m-8.215-2.13.053.162.168-.002-.137.098.052.162-.135-.1-.136.1.055-.162-.138-.098.17.002m8.961 8.447.04.127h.133l-.107.076.04.127-.106-.078-.108.078.043-.127-.11-.076h.133m11.999-6.258.084.258h.27l-.218.156.082.258-.217-.16-.22.16.087-.258-.22-.156h.27M49.62 35.81l.083.257h.27l-.22.157.083.257-.217-.16-.22.16.086-.256-.22-.157h.27m1.502.078.084.257h.27l-.218.157.084.257-.22-.16-.216.16.084-.257-.218-.157h.27m-2.947-.088.084.258h.27l-.22.156.085.257-.22-.16-.217.16.084-.258-.22-.157h.27m-2.236-.591.085.257h.27l-.22.157.083.257-.217-.16-.217.16.086-.256-.222-.157h.27m4.012 2.335.083.258h.27l-.22.157.083.258-.217-.16-.22.16.086-.258-.22-.156h.27M32.23 31.155l.125.387.406-.002-.33.238.128.387-.328-.24-.328.24.127-.387-.33-.238.405.002m20.37 1.27.125.386.406-.002-.33.24.127.385-.328-.24-.33.24.128-.385-.33-.24.41.003m-5.398-9.837.125.387.406-.003-.33.238.127.387-.328-.24-.328.24.127-.387-.33-.238.408.002m5.361 11.492.11.34.355-.003-.287.21.11.337-.287-.21-.287.21.112-.338-.29-.21.358.003m.919-1.479.11.34.355-.002-.286.21.11.337-.288-.21-.287.21.11-.338-.29-.21.358.003m-3.278 2.604.11.34.354-.002-.287.21.11.337-.288-.21-.288.21.11-.34-.288-.208.358.002m-2.714.017.11.34h.355l-.29.208.112.338-.287-.21-.287.21.11-.338-.288-.21.356.003m-9.518-9.336.11.34.356-.002-.29.21.112.337-.287-.21-.286.21.112-.338-.29-.21.356.003m7.091 2.643.11.34.355-.002-.288.21.11.336-.288-.21-.287.21.112-.337-.29-.21.357.003M42.54 30.17l.11.34.356-.003-.29.21.112.337-.287-.21-.287.21.112-.338-.29-.21.356.003m-7.309 2.161.11.34.354-.003-.287.21.11.337-.287-.21-.288.21.112-.338-.29-.21.358.003m-4.595-.444.11.34.356-.002-.287.21.108.337-.287-.21-.286.21.112-.338-.29-.21.358.003',
          fill: '#FFF',
        }),
        h('path', {
          fill: '#FFF',
          d: 'M29.54 22.68c-.308.694-.552 1.42-.745 2.17a32.365 32.365 0 0 1 5.605-.495c8.314 0 15.893 3.135 21.63 8.283.226-.727.38-1.482.49-2.254a34.285 34.285 0 0 0-26.98-7.703z',
        }),
        h('path', {
          fill: '#009739',
          d: 'M30.248 22.923c-.334.04-.566.373-.52.742.044.37.35.637.685.596.332-.038.566-.372.52-.74-.047-.373-.353-.638-.685-.597zm.132 1.09c-.195.023-.377-.145-.406-.377-.027-.232.107-.44.303-.465s.377.146.406.378-.107.44-.303.465zm1.825-1.276-.768.055.074 1.348.25-.018-.034-.5.52-.037c.143.13.17.36.18.49l.23-.016c-.012-.153-.04-.444-.19-.55a.417.417 0 0 0 .192-.38.426.426 0 0 0-.453-.393zm.023.598-.52.037-.023-.346.52-.037a.171.171 0 0 1 .184.16.173.173 0 0 1-.162.185zm1.605-.662-.635.012.023 1.35.638-.012a.578.578 0 0 0 .566-.588l-.002-.193a.58.58 0 0 0-.59-.57zm0 1.1-.365.005-.016-.848.367-.008c.2-.004.368.158.372.36l.002.116a.367.367 0 0 1-.36.374zm1.342 0 .982.034-.007.253-1.215-.043.047-1.35 1.156.04-.008.25-.926-.03-.008.27.77.027-.008.23-.77-.027-.013.347zm2.465-.952.336.03-.117 1.344-.23-.02.08-.922-.35.898-.212-.018-.19-.947-.08.924-.23-.022.118-1.344.336.03.19.944.348-.897zm2.01.388.975.166-.04.23-.745-.128-.035.21.627.106-.04.227-.626-.108-.053.305.77.133-.04.227-.997-.17.204-1.2zm3.46.592-.746-.193-.357 1.3.244.065.126-.486.524.134a.42.42 0 0 0 .516-.305.421.421 0 0 0-.305-.515zm-.167.574-.504-.13.087-.337.504.13c.093.024.15.118.124.212a.174.174 0 0 1-.21.124zm1.88-.074-.733-.23-.426 1.28.24.075.15-.48.496.16c.086.17.027.395-.012.52l.22.068c.046-.146.128-.426.022-.58.145-.03.27-.13.32-.28a.42.42 0 0 0-.276-.533zm-.196.564-.498-.156.104-.33.496.156c.092.027.143.125.113.217s-.124.144-.216.114zm1.71-.037c-.313-.12-.675.07-.806.418-.13.35.02.73.333.846.314.118.676-.07.807-.42s-.02-.726-.332-.843zm.1.756c-.083.22-.3.342-.485.273-.184-.07-.268-.303-.186-.523.082-.22.3-.342.484-.27.184.067.268.3.186.52zm3.336.748-.69-.343-.62 1.2.225.11.223-.45.468.233c.06.186-.035.396-.094.514l.207.104c.07-.14.192-.402.114-.57a.418.418 0 0 0 .36-.23.424.424 0 0 0-.19-.567zm-.052.448a.17.17 0 0 1-.23.078l-.466-.232.154-.31.465.23c.086.045.12.148.078.234zm1.014.342-.134.234.672.38-.113.202-.673-.38-.17.302.855.484-.123.217-1.06-.6.666-1.173 1.006.568-.123.22-.806-.455zm2.227 1.53-.247-.16c.078-.122-.008-.24-.137-.32-.127-.08-.23-.118-.305 0-.124.188.712.544.456.946-.19.297-.52.168-.738.027-.188-.12-.467-.4-.285-.684l.258.16c-.07.116 0 .243.163.347.164.104.273.1.32.025.148-.23-.705-.568-.44-.973.226-.35.612-.077.76.015.145.095.382.335.198.614zm1.446 1.01-.24-.173c.084-.117.006-.238-.12-.328-.122-.087-.222-.13-.304-.017-.135.182.682.582.404.97-.203.286-.525.14-.738-.01-.18-.13-.443-.425-.248-.7l.248.178c-.078.11-.012.24.145.353.158.11.27.115.318.043.16-.223-.673-.605-.39-.994.244-.336.62-.045.76.055s.364.355.166.622zm1.21.417c-.26-.21-.66-.14-.894.15s-.207.697.055.906c.264.21.664.14.896-.15s.208-.697-.056-.906zm-.14.75c-.144.184-.388.232-.542.11-.154-.122-.16-.37-.016-.554.146-.184.39-.232.545-.11.154.123.16.37.014.554zm-8.08-4.855c-.095.215-.022.453.157.53.127.056.27.015.38-.087l-.198-.086.076-.18.24.106v-.002l.052.023.178.078-.27.62-.176-.08.08-.183a.552.552 0 0 1-.46.02c-.308-.135-.437-.52-.288-.86s.518-.513.826-.378c.238.104.365.36.34.633l-.25-.11c-.014-.13-.078-.243-.19-.294-.18-.077-.404.034-.497.25z',
        }),
      ],
    )
  },
})

export default BRA
