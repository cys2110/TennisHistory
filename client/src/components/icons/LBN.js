import { defineComponent, h } from 'vue'

const LBN = defineComponent({
  name: 'LBN',
  render() {
    return h(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 900 600',
        width: '900',
        height: '600',
      },
      [
        h('path', { d: 'M0 0h900v600H0z', fill: '#D1001F' }),
        h('path', { d: 'M0 150h900v300H0z', fill: '#fff' }),
        h('path', {
          d: 'm445.62 150h0.3125c2.625 7.5494 6.5312 14.32 11.719 20.312 3.2906 3.8172 7.1969 6.7859 11.719 8.9062 5.9688 1.2056 11.906 2.56 17.812 4.0625 3.1281 0.99125 6.15 2.2412 9.0625 3.75 3.4188 2.0647 6.75 4.2522 10 6.5625 5.4156 4.1666 10.834 8.3334 16.25 12.5 1.2188 0.95406 0.95938 1.3188-0.78125 1.0938-5.9875-0.63938-11.978-0.74375-17.969-0.3125-0.05 0.42906 3e-3 0.84594 0.15625 1.25 9.5719 8.9397 20.459 15.867 32.656 20.781-5.7406 0.28188-11.469 0.17781-17.188-0.3125-2-0.44156-3.9781-0.9625-5.9375-1.5625-4.6844-2.9678-9.7875-4.1134-15.312-3.4375-2.9469 0.6375-4.0406 2.3562-3.2812 5.1562 1.0156 1.2256 2.2125 2.215 3.5938 2.9688 2.8094 1.2994 5.5156 2.7578 8.125 4.375 6.2906 4.3081 12.125 9.2041 17.5 14.688 10.709 8.5881 22.169 16.088 34.375 22.5 2.2125 1.2866 4.1406 2.9009 5.7812 4.8438 0.24375 0.60406 0.0875 1.0728-0.46875 1.4062-1.0656 0.32125-2.1594 0.4775-3.2812 0.46875-7.8781-0.82531-15.744-1.815-23.594-2.9688-1.875-0.20844-3.75-0.20844-5.625 0-2.2625 0.82531-2.9406 2.3359-2.0312 4.5312 1.5 1.3491 3.2188 2.3388 5.1562 2.9688 11.072 2.5475 22.009 5.5684 32.812 9.0625 2.7844 0.89031 5.3375 2.1925 7.6562 3.9062 0.1875 1.2775-0.38437 2.0588-1.7188 2.3438-2.6812 0.65531-5.3906 1.1762-8.125 1.5625-7.2781 0.60719-14.569 1.0238-21.875 1.25-2.9188 0.41688-5.8344 0.83344-8.75 1.25-2.0031 0.35125-3.7219 1.2366-5.1562 2.6562-0.19375 2.1041 0.79687 3.3022 2.9688 3.5938 2.9031 0.35938 5.8188 0.5675 8.75 0.625 5.0875 0.66875 9.6688 2.5438 13.75 5.625 2.5938 2.9062 5.3031 5.7188 8.125 8.4375 8.6812 7.6188 17.534 15.016 26.562 22.188-2.7875 0.65-5.6 1.1719-8.4375 1.5625-3.425 0.41875-6.6562-0.20625-9.6875-1.875-3.9594-2.0844-7.9156-4.1656-11.875-6.25-1.2375-0.575-2.5406-0.8375-3.9062-0.78125-3.4438 0.75625-6.6219 2.1625-9.5312 4.2188-2.5781 1.6188-3.15 3.7562-1.7188 6.4062 2.5531 2.6531 5.4188 4.8938 8.5938 6.7188 6.9281 3.9344 13.909 7.7875 20.938 11.562 6.8 3.8844 13.259 8.2594 19.375 13.125 2.8312 2.3062 5.0719 5.0688 6.7188 8.2812 0.43125 2.9406-0.76563 4.8688-3.5938 5.7812-3.2594 0.3032-6.2812-0.425-9.0625-2.1875-7.0781-5-14.372-9.6875-21.875-14.062-3.825-2.4562-7.9906-3.9125-12.5-4.375-11.772-0.11562-23.544-0.11562-35.312 0-2.6625-0.23125-5.2688-0.75313-7.8125-1.5625-4.8594-2.3781-9.7531-4.6688-14.688-6.875-2.0375-0.69063-4.1188-0.9-6.25-0.625-4.875 2.5062-7.5312 6.5156-7.9688 12.031-0.20938 6.4594-0.20938 12.916 0 19.375 0.0375 8.7625 2.85 16.472 8.4375 23.125 7.0625 6.9625 14.406 13.575 22.031 19.844 3.225 2.8594 6.0375 6.0344 8.4375 9.5313h-8.4375c-1.4438-0.8313-2.7969-1.8188-4.0625-2.9688-3.3344-3.5406-6.6656-7.0844-10-10.625-3.1594-1.9625-6.5969-3.1093-10.312-3.4375-3.75-0.4156-7.5-0.8344-11.25-1.25-2.2031-0.25-4.3906-0.1969-6.5625 0.1563-0.35 1.1531-0.29687 2.2969 0.15625 3.4375 1.2719 2.0031 2.4156 4.0875 3.4375 6.25 0.375 1.0093 0.53125 2.05 0.46875 3.125-1.5375 0.066-2.8906-0.4031-4.0625-1.4063-4.9688-4.8656-10.384-9.1375-16.25-12.812-2.6031-2.025-3.9031-4.6812-3.9062-7.9687-1.1812-2.4375-3.1094-3.325-5.7812-2.6563-2.7656 0.9063-5.5781 1.5813-8.4375 2.0313-2.4781-0.1844-4.7688-0.9656-6.875-2.3438-4.5938-1.1625-8.8656-0.4344-12.812 2.1875-3.5156 2.4719-6.8469 5.1813-10 8.125-8.8531 6.3188-18.75 9.4438-29.688 9.375-6.975 1.4094-12.494 5.0032-16.562 10.781h-3.75c-0.05-0.5313 3e-3 -1.0531 0.15625-1.5625 3.2094-5.5 7.6375-9.7188 13.281-12.656 7.5781-1.5156 14.453-4.5375 20.625-9.0625 6.2125-5.7156 11.578-12.122 16.094-19.219 3.0469-4.5313 5.3375-9.4282 6.875-14.688 1.0438-4.4844 0.52188-8.7562-1.5625-12.812-3.7125-5.0594-8.6594-8.1844-14.844-9.375-1.9125 0.26875-3.7875 0.7375-5.625 1.4062-13.534 6.2469-27.284 11.975-41.25 17.188-6.0344 1.6719-12.178 2.5562-18.438 2.6562-4.1094 0.35625-7.9625-0.425-11.562-2.3438-1.3938-1.3688-2.0188-2.9844-1.875-4.8438 4.7062-1.9344 9.4969-3.6531 14.375-5.1562 11.719-3.0469 22.969-7.3188 33.75-12.812 3.1562-1.7594 5.9188-4 8.2812-6.7188 1.7438-2.5094 1.3781-4.6469-1.0938-6.4062-6.0969-2.9594-12.034-2.6469-17.812 0.9375-1.925 1.4312-3.9031 2.7844-5.9375 4.0625-10.534 5.525-21.575 9.6906-33.125 12.5-6.6588 1.725-11.763-0.30625-15.312-6.0938 2.8012-0.0719 5.6138-0.125 8.4375-0.15625 0.89875-0.1375 1.7322-0.45 2.5-0.9375 1.8281-1.2781 3.5969-2.6312 5.3125-4.0625 8.1469-8.7812 17.209-16.384 27.188-22.812 5.3094-2.7594 10.519-5.675 15.625-8.75 1.4531-1.1375 2.5469-2.5438 3.2812-4.2188 0.34375-3.7594-0.69687-7.0938-3.125-10-1.4281-2.0428-3.3531-2.8241-5.7812-2.3438-3.7 2.3188-7.3438 4.7125-10.938 7.1875-2.7062 1.5094-5.5188 2.7594-8.4375 3.75-4.2438 0.0688-7.9938-1.2875-11.25-4.0625-0.51875-0.45-0.725-1.025-0.625-1.7188 0.53125 0.05 1.0531-3e-3 1.5625-0.15625 1.4594-1.0406 2.9156-2.0844 4.375-3.125 4.9812-4.3553 9.7719-8.9388 14.375-13.75 3.3688-3.1578 7.2219-5.5538 11.562-7.1875 3.8031-0.54875 7.3438-1.7988 10.625-3.75 4.0625-3.6019 7.6562-7.6122 10.781-12.031 1.7125-2.1138 2.3375-4.5097 1.875-7.1875-0.87187-2.3659-1.9125-4.6578-3.125-6.875-0.70625-1.435-1.8531-2.2684-3.4375-2.5-3.7844 1.1569-7.5844 2.2506-11.406 3.2812-3.5062 0.73219-7.05 0.94063-10.625 0.625-2.4375-0.34469-3.2188-1.6469-2.3438-3.9062 1.3125-1.4169 2.7188-2.7191 4.2188-3.9062 5.2062-3.7497 10.622-7.1872 16.25-10.312 4.6938-2.0462 9.1719-4.4422 13.438-7.1875 1.9594-1.5759 3.1594-3.6072 3.5938-6.0938 2.9875-4.9606 7.3094-8.1375 12.969-9.5312 7.4031 0.43437 8.9656-2.3781 4.6875-8.4375-1.0562-0.6125-2.2031-0.87281-3.4375-0.78125-2.375 0.48438-4.7688 0.64063-7.1875 0.46875-0.44063-0.115-0.75313-0.37531-0.9375-0.78125 0.64063-1.4219 1.5781-2.6197 2.8125-3.5938 3.2656-2.6394 6.7031-5.0353 10.312-7.1875 7.3312-2.8559 13.738-7.0747 19.219-12.656 0.70938-0.81875 0.91875-1.7562 0.625-2.8125-0.4375-0.1925-0.90625-0.29656-1.4062-0.3125-4.4906 1.3053-8.9719 2.6597-13.438 4.0625-0.31875-0.15687-0.37188-0.365-0.15625-0.625 6.2562-7.7141 13.494-14.329 21.719-19.844 6.925-5.7231 12.238-12.65 15.938-20.781zm-34.688 56.875c1.9469-0.17531 3.8219 0.085 5.625 0.78125 0.4375 0.33187 0.75 0.74844 0.9375 1.25-1.8531 3.2594-4.4562 5.7072-7.8125 7.3438-0.60313-0.0281-0.96563-0.34063-1.0938-0.9375-0.20938-1.875-0.20938-3.75 0-5.625 0.2875-1.3794 1.0688-2.3169 2.3438-2.8125zm35.313 6.2506c2.1281-0.42531 3.6375 0.30406 4.5312 2.1875 0.33125 1.945 0.12188 3.82-0.625 5.625-1.9344 1.6881-4.1719 2.7819-6.7188 3.2812-3.2812 0.90719-6.6156 1.3238-10 1.25-0.8375-1.0581-1.0969-2.2559-0.78125-3.5938 1.2781-2.0738 2.9969-3.6881 5.1562-4.8438 2.7656-1.4884 5.5781-2.7903 8.4375-3.9062zm14.374-1.2498c2.7375-0.35781 4.8719 0.57969 6.4062 2.8125 0.20938 1.0416 0.20938 2.0834 0 3.125-0.49375 0.48157-1.0656 0.84626-1.7188 1.0938-2.525 0.28157-5.025 0.17751-7.5-0.3125-0.25937-0.26031-0.52188-0.52093-0.78125-0.78125-0.66875-3.1287 0.52813-5.1078 3.5938-5.9375zm18.438 1.2498c1.15-0.0516 2.2969 3.1e-4 3.4375 0.15625 0.55937 0.24531 1.0281 0.60969 1.4062 1.0938 0.39375 6.3775-2.575 9.2422-8.9062 8.5938-0.55937-0.24531-1.0281-0.60969-1.4062-1.0938-1.0781-4.8353 0.74375-7.7522 5.4688-8.75zm56.563 113.75c1.7-6e-3 3.2625 0.4625 4.6875 1.4062 1.3906 0.86875 2.6937 1.8594 3.9062 2.9688 0.45624 0.89687 0.55936 1.8344 0.3125 2.8125-1.9938 2.9344-4.3375 5.5906-7.0312 7.9688-0.53439 0.48125-1.1594 0.74375-1.875 0.78125-2.3719-0.4875-4.7688-0.85312-7.1875-1.0938-1.4562-0.28438-2.8125-0.80625-4.0625-1.5625-0.76877-0.55937-1.2875-1.2875-1.5625-2.1875 0.34686-0.95625 0.81561-1.8406 1.4062-2.6562 3.3062-3.5469 7.1062-6.3594 11.406-8.4375zm-27.813-5.6254c3.1344-0.40625 6.0531 0.16562 8.75 1.7188 1.0688 1.4969 1.225 3.1125 0.46875 4.8438-4.6344 6.3281-10.728 8.3594-18.281 6.0938-1.5781-0.74688-2.9844-1.7375-4.2188-2.9688-0.42812-0.6875-0.53438-1.4156-0.3125-2.1875 3.8938-3.6906 8.425-6.1906 13.594-7.5zm-0.937-49.063c3.9031-0.62687 6.6656 0.83157 8.2812 4.375 0.0719 5.9325-2.7938 8.1722-8.5938 6.7188-1.9-0.96531-3.5156-2.2675-4.8438-3.9063 0.33125-3.3647 2.05-5.7606 5.1562-7.1875zm-58.126-28.749c1.4438-0.15844 2.7969 0.10189 4.0625 0.78125 1.3219 1.6791 1.1125 3.1894-0.625 4.5312-1.8938 1.6781-4.0812 2.4594-6.5625 2.3438-2.7781-0.83906-5.4875-1.8284-8.125-2.9688 3.6312-1.9222 7.3812-3.4847 11.25-4.6875zm-69.375 59.375c4.6437-0.26594 9.225 0.0987 13.75 1.0938 4.6312 1.5456 4.9437 3.7331 0.9375 6.5625-7.0219 4.6312-14.731 7.1312-23.125 7.5-1.6844-1.1281-2.8812-2.6375-3.5938-4.5312-1-2.2666-1.9375-4.5581-2.8125-6.875-0.24375-0.45124-0.19063-0.86782 0.15625-1.25 1.7281-0.60626 3.4969-1.075 5.3125-1.4062 3.1688-0.39782 6.2938-0.76219 9.375-1.0938zm86.25-60.312c2.5406 0.01 3.7906 1.3122 3.75 3.9062 0.11874 3.9362-1.7563 6.2278-5.625 6.875-5.1031 1.1534-6.3-0.46124-3.5938-4.8438 1.4-2.3972 3.2219-4.3762 5.4688-5.9375zm18.437 5.625c3.5844-0.25375 6.9188 0.5275 10 2.3438 1.3312 0.83844 1.9562 2.0362 1.875 3.5938 0.1375 2.5478-0.59063 4.7875-2.1875 6.7188-2.0219 0.73969-4.1031 0.94813-6.25 0.625-2.6438-0.60375-5.2469-1.3328-7.8125-2.1875-4.2125-1.2519-4.8875-3.5956-2.0312-7.0312 1.7094-2.0847 3.8469-3.4391 6.4062-4.0625zm-69.063 38.125c4.1375 0.42906 7.3156 2.4081 9.5312 5.9375 0.22812 2.3719-0.86563 3.2572-3.2812 2.6562-3.0156-1.2422-5.3594-3.2734-7.0312-6.0938-0.30625-1.0234-0.0469-1.8566 0.78125-2.5zm-12.188-36.563c2.8156-0.0519 5.6281 0 8.4375 0.15625 2.4813 0.33281 3.1594 1.635 2.0312 3.9062-1.9938 2.9344-4.3375 5.5906-7.0312 7.9687-1.8656 1.6678-3.3781 1.4075-4.5312-0.78125-1.3156-2.225-2.0969-4.6209-2.3438-7.1875-6e-3 -0.77032 0.15-1.4994 0.46875-2.1875 0.8875-0.83219 1.8781-1.4572 2.9688-1.875zm37.5 88.125c3.7438 0.12813 7.3906 0.80625 10.938 2.0312 0.64062 0.21563 1.1625 0.57813 1.5625 1.0938-2.5594 4.3812-5.425 8.5469-8.5938 12.5-1.7812-4.7219-3.1875-9.5656-4.2188-14.531 0.0469-0.39375 0.15-0.75625 0.3125-1.0938zm24.687-43.125c1.1406 0.0381 2.025 0.55876 2.6562 1.5625 1.5312 2.5438 1.7906 5.2 0.78125 7.9688-1.9844 0.38751-3.2844-0.39374-3.9062-2.3438-1.1844-2.5338-1.0281-4.9294 0.46875-7.1875zm-81.875-41.563c3.8281-0.77812 6.9031 0.36781 9.2188 3.4375 1.7969 2.8653 3.5156 5.7819 5.1562 8.75-3.2656 1.7262-6.7031 2.82-10.312 3.2812-0.41562-0.20844-0.83438-0.41656-1.25-0.625-3.0031-2.9331-5.3469-6.3188-7.0312-10.156-0.24687-0.97938-0.14375-1.9169 0.3125-2.8125 1.2-0.9 2.5031-1.525 3.9062-1.875zm68.75 34.063c1.5375 0.12469 2.7375 0.85406 3.5938 2.1875 1.7625 2.3781 3.1156 4.9822 4.0625 7.8125 0.20937 1.3541 0.20937 2.7084 0 4.0625-0.82188 1.635-2.125 2.2078-3.9062 1.7188-8.5656-3.5012-9.8156-8.7619-3.75-15.781zm-49.687 47.812c5.7094-0.49062 8.9906 2.1156 9.8438 7.8125 0.38437 3.3031 0.0719 6.5344-0.9375 9.6875-1.1688 1.4219-2.4719 1.5781-3.9062 0.46875-1.0781-1.1656-1.9656-2.4688-2.6562-3.9062-1.5406-4.2812-2.5812-8.6562-3.125-13.125 0.325-0.27187 0.5875-0.58437 0.78125-0.9375zm35.313-52.812c2.6219-0.51875 3.9781 0.52312 4.0625 3.125-0.17813 1.7491-0.64688 3.4156-1.4062 5-1.6188 2.1334-3.0781 2.0294-4.375-0.3125-0.85938-1.9484-0.9625-3.9278-0.3125-5.9375 0.59687-0.73625 1.275-1.3612 2.0312-1.875zm-15.001 59.062c3.025-0.2625 5.4719 0.78125 7.3438 3.125 0.74688 1.8062 0.95625 3.6812 0.625 5.625-0.5125 1.85-1.6062 2.3188-3.2812 1.4062-2.3562-2.6812-4.0219-5.7531-5-9.2188 0.0594-0.3375 0.1625-0.65 0.3125-0.9375zm1.5628-117.92c1.9969-0.20312 3.0406 0.6825 3.125 2.6562-0.69063 4.1284-2.775 7.3575-6.25 9.6875-2.55 1.5869-5.2562 2.8369-8.125 3.75-1.1469 0.20844-2.2906 0.20844-3.4375 0-0.625-0.88781-0.78125-1.8772-0.46875-2.9688 3.6156-6.0944 8.6688-10.469 15.156-13.125z',
          'clip-rule': 'evenodd',
          fill: '#00703C',
          'fill-rule': 'evenodd',
          'image-rendering': 'optimizeQuality',
          'shape-rendering': 'geometricPrecision',
        }),
      ],
    )
  },
})

export default LBN
