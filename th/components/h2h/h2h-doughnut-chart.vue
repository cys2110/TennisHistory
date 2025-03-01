<script setup lang="ts">
const props = defineProps<{ winLoss: number[] }>()
const formattedData = computed(() => {
  return [
    { value: props.winLoss[0], itemStyle: { color: "#7c3aed" } },
    { value: props.winLoss[1], itemStyle: { color: "#0d9488" } }
  ]
})

const option = ref({
  backgroundColor: "transparent",
  textStyle: { color: "#94a3b8" },
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
    class="!h-[350px] !w-[250px]"
    :option="option"
    :autoresize="true"
  />
</template>
