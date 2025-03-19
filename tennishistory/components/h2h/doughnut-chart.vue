<script setup lang="ts">
const props = defineProps<{ winLoss: number[] }>()
const colorMode = useColorMode()

const formattedData = computed(() => {
  return [
    { value: props.winLoss[0], itemStyle: { color: CHART_COLOURS.violet700 } },
    { value: props.winLoss[1], itemStyle: { color: CHART_COLOURS.emerald700 } }
  ]
})

const option = ref({
  backgroundColor: "transparent",
  darkMode: colorMode.value === "dark",
  textStyle: { color: colorMode.value === "dark" ? CHART_COLOURS.lightText : CHART_COLOURS.darkText },
  series: [
    {
      type: "pie",
      radius: ["40%", "60%"],
      data: formattedData.value,
      label: {
        formatter: function () {
          return `${props.winLoss[0]}—${props.winLoss[1]}\n${percentage(props.winLoss[0], props.winLoss[0] + props.winLoss[1])}%`
        },
        position: "center",
        fontWeight: "bolder",
        fontSize: 18,
        lineHeight: 40
      }
    }
  ]
})
</script>

<template>
  <v-chart
    class="!w-[300px]"
    :option="option"
    :autoresize="true"
  />
</template>
