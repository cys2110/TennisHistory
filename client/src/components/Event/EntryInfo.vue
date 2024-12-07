<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { Grid } from 'ant-design-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TreeChart } from 'echarts/charts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { CHART_OPTIONS, COLOURS } from '@/utils/variables'
import { EntryConnectionNode } from '@/utils/types'

const props = defineProps<{
  entryInfo: { array: EntryConnectionNode['edges'][]; title: string }[]
}>()
const { useBreakpoint } = Grid
const screens = useBreakpoint()

const treeData = {
  name: 'Entry Information',
  children: props.entryInfo.map((info) => ({
    name: info.title,
    children: info.array.map((player) => {
      const childNodes = []
      if (player.properties?.rank) childNodes.push({ name: player.properties.rank })
      if (player.properties?.reason) childNodes.push({ name: player.properties.reason })

      return {
        name: player.node?.player.full_name || player.node?.player.full_name,
        children: childNodes.length > 0 ? childNodes : undefined,
      }
    }),
  })),
}

const orientation = computed(() => (screens.value.xs ? 'TB' : 'LR'))
const rotation = computed(() => (screens.value.xs ? -90 : 0))
const bottomGrid = computed(() => (screens.value.xs ? '30%' : '1%'))

use([TreeChart, CanvasRenderer])
provide(THEME_KEY, 'dark')

const option = ref({
  ...CHART_OPTIONS,
  series: [
    {
      type: 'tree',
      data: [treeData],
      top: '1%',
      left: '20%',
      bottom: bottomGrid,
      right: '20%',
      symbolSize: 7,
      orient: orientation,
      label: {
        position: 'top',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 12,
      },
      labelLayout: { rotate: rotation },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          rotate: rotation,
        },
      },
      itemStyle: { color: COLOURS.violet700 },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
    },
  ],
})
</script>

<template>
  <div id="entry-info" class="text-4xl">Entry Information</div>
  <v-chart class="!h-[400px] !w-full" :option="option" :autoresize="true" />
</template>
