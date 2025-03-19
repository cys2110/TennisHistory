<script setup lang="ts">
definePageMeta({
  name: "wl-index",
  layout: "dashboard-layout"
})
const id = useRouteParams<string>("id")
const toast = useToast()
const formatName = useFormatName()
const checked = ref(false)

const categoryColours = {
  "Match Record": CHART_COLOURS.sky700,
  "Pressure Points": CHART_COLOURS.fuchsia600,
  Environment: CHART_COLOURS.violet700,
  Other: CHART_COLOURS.emerald700
}

// API call
const { data: index } = await useFetch<WLIndexInterface[]>("/api/wl-index", {
  query: { id },
  transform: (data): WLIndexInterface[] => {
    return data.map(indice => ({
      ...indice,
      titles: indice.titles || null,
      value: indice.wins === "0" && indice.losses === "0" ? 0 : Number((Number(indice.wins) / (Number(indice.wins) + Number(indice.losses))).toFixed(3))
    }))
  },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s details`
    })
  }
})
</script>

<template>
  <player-wrapper>
    <template
      #toolbar-left
      v-if="!checked"
    >
      <div
        v-for="(entry, index) in Object.entries(categoryColours)"
        :key="index"
        class="mx-5 flex"
      >
        <div
          class="rounded-lg !w-9 mx-2"
          :style="{ backgroundColor: entry[1] }"
        ></div>
        <div class="text-neutral-600 dark:text-neutral-400 self-center">{{ entry[0] }}</div>
      </div>
    </template>
    <template #toolbar-right>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS.table"
        :unchecked-icon="ICONS['line-scatter']"
        :label="checked ? 'Table view' : 'Chart view'"
      />
    </template>

    <wl-index-chart
      v-if="index && !checked"
      :index
    />

    <wl-index-table
      v-else-if="index"
      :index
    />

    <error-message
      v-else
      :icon="ICONS['no-chart']"
      :title="`No win-loss index available for ${formatName.capitaliseName.value}`"
    />
  </player-wrapper>
</template>
