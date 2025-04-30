<script setup lang="ts">
const { c1, c2 } = defineProps<{ c1: CountryInterface; c2: CountryInterface }>()
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const p1ParamName = useRouteParams<string>("p1Name")
const p2ParamName = useRouteParams<string>("p2Name")
const p1Name = computed(() => decodeName(p1ParamName.value))
const p2Name = computed(() => decodeName(p2ParamName.value))

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind)
const lgAndUp = breakpoints.greaterOrEqual("lg")

// API call
const { data: h2h, refresh } = await useFetch<{
  p1: H2HPlayerInterface
  p2: H2HPlayerInterface
  p1Wins: number
  p2Wins: number
}>("/api/h2h", {
  query: { p1Id, p2Id },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching head to head for ${p1Name.value} v. ${p2Name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

watch(
  () => [p1Id.value, p2Id.value],
  ([newP1, newP2]) => {
    if ((newP1 || newP2) && route.name === "h2h-players") refresh()
  },
  { immediate: true }
)
</script>

<template>
  <div
    v-if="h2h"
    class="flex gap-10 justify-center mb-10"
  >
    <ClientOnly>
      <h2h-player-card
        v-if="h2h && lgAndUp"
        :player="h2h.p1"
        :index="1"
        :id="p1Id"
        :country="c1"
      />
    </ClientOnly>

    <div class="flex flex-col items-center flex-1">
      <doughnut-chart
        :p1-wins="h2h.p1Wins"
        :p2-wins="h2h.p2Wins"
      />
      <h2h-table
        :h2h
        :c1
        :c2
      />
    </div>

    <ClientOnly>
      <h2h-player-card
        v-if="h2h && lgAndUp"
        :player="h2h.p2"
        :index="2"
        :id="p2Id"
        :country="c2"
      />
    </ClientOnly>
  </div>
  <error-message
    v-else
    :title="`No head to head found for ${p1Name} v. ${p2Name}`"
    :icon="ICONS.noH2H"
  />
</template>
