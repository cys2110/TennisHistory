<script setup lang="ts">
definePageMeta({ name: "draws" })
const {
  params: { eid }
} = useRoute("draws")
const selectedTour = ref<TourType>("ATP")
const selectedType = ref<MatchType>("Singles")
const selectedDraw = ref<DrawType>("Main")

const { data } = await useFetch<any>("/api/events/getDrawType", { key: `drawTypes-${eid}`, params: { id: eid }, server: false })
const matchTypes = computed(() => {
  if (!data.value) return []
  return useArrayUnique(
    Object.values(data.value)
      .map(d => Object.keys(d as any))
      .flat()
  ).value
})

watch(
  [selectedTour, selectedType, selectedDraw],
  () => {
    if (!data.value?.[selectedTour.value]?.[selectedType.value]) {
      selectedType.value = (matchTypes.value[0] as MatchType) || "Singles"
    }
    if (selectedDraw.value === "Qualifying" && !data.value?.[selectedTour.value]?.[selectedType.value]?.q_draw) {
      selectedDraw.value = "Main"
    }
  },
  { immediate: true }
)
</script>

<template>
  <event-wrapper>
    <template #toolbar>
      <filter-radio-tour
        v-model="selectedTour"
        :tours="data ? Object.keys(data) as TourType[] : []"
        size="md"
      />
      <filter-radio-match-type
        v-if="matchTypes.length === 2"
        v-model="selectedType"
        size="md"
      />
      <filter-radio-draw-type
        v-if="data && Object.values(data).flatMap(d => Object.values(d as any)).some((dt: any) => dt.q_draw)"
        v-model="selectedDraw"
        size="md"
      />
    </template>

    <event-draws-country v-if="data?.draw_type" />

    <event-draws-rr v-else-if="data?.[selectedTour]?.[selectedType] === 'Round Robin'" />

    <event-draws-regular
      v-else
      v-model="selectedTour"
      v-model:type="selectedType"
      v-model:draw="selectedDraw"
    />
  </event-wrapper>
</template>
