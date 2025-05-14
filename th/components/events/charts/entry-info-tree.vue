<script setup lang="ts">
const { data } = defineProps<{ data: EntryInfoType[] }>()
const route = useRoute()
const colorMode = useColorMode()

const treeData = {
  name: "Entry Information",
  children: data.map(info => ({
    name: info.label,
    children: info.content.map(player => {
      const childNodes = []
      if (player.rank) childNodes.push({ name: Number(player.rank) })
      if (player.reason) childNodes.push({ name: player.reason })

      return {
        name: player.name,
        children: childNodes.length > 0 ? childNodes : undefined
      }
    })
  }))
}

const option = ref({
  backgroundColor: "transparent",
  darkMode: colorMode.value === "dark",
  textStyle: { color: colorMode.value === "dark" ? COLOURS.darkText : COLOURS.lightText },
  series: [
    {
      type: "tree",
      data: [treeData],
      top: "1%",
      left: "20%",
      right: "20%",
      symbolSize: 7,
      label: {
        position: "top",
        verticalAlign: "middle",
        align: "right",
        fontSize: 12
      },
      leaves: {
        label: {
          position: "right",
          verticalAlign: "middle",
          align: "left"
        }
      },
      itemStyle: { color: COLOURS.violet700 },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
      initialTreeDepth: 4
    }
  ]
})
</script>

<template>
  <u-modal
    :title="`${route.params.name} ${route.params.year}`"
    description="Entry Information"
    fullscreen
  >
    <u-button
      label="Chart view"
      :icon="ICONS.treeDiagram"
      size="xs"
    />

    <template #body>
      <v-chart
        class="min-h-200 w-full"
        :option
        :autoresize="true"
      />
    </template>
  </u-modal>
</template>
