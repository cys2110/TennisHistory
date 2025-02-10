<script setup lang="ts">
const { data } = defineProps<{ data: EventEntryInfoType[] }>()

// FIXME: Dark mode colors

const treeData = {
  name: "Entry Information",
  children: data.map(info => ({
    name: info.label,
    children: info.content.map(player => {
      const childNodes = []
      if (player.rank) childNodes.push({ name: parseInt(player.rank) })
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
  textStyle: { color: "#cbd5e1" },
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
      itemStyle: { color: "#7c3aed" },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750
    }
  ]
})
</script>

<template>
  <v-chart
    ref="chartRef"
    class="!h-[500px] !w-full"
    :option="option"
    :autoresize="true"
  />
</template>
