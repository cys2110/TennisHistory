<script setup lang="ts">
definePageMeta({ name: "wl-index", layout: "player-layout" })
const formatName = useFormatName()
const id = useRouteParams<string>("id")
const checked = ref(false)
const toast = useToast()

const { data: index } = await useFetch<WLIndexType[]>("/api/wlIndex", {
  query: { id },
  transform: (data): WLIndexType[] => {
    return data.map(indice => ({
      ...indice,
      titles: indice.titles || null,
      value: indice.wins === "0" && indice.losses === "0" ? 0 : Number((Number(indice.wins) / (Number(indice.wins) + Number(indice.losses))).toFixed(3))
    }))
  },
  onResponseError: error => {
    toast.add({
      title: `Error fetching win-loss index for ${formatName.capitaliseName.value}`,
      icon: ICONS.error,
      description: error.error?.message
    })
  }
})
</script>

<template>
  <u-container v-if="index">
    <u-switch
      v-model="checked"
      :checked-icon="ICONS['line-scatter']"
      :unchecked-icon="ICONS.table"
      class="justify-self-end"
    />

    <wl-index-chart
      v-if="checked"
      :index
    />
    <wl-index-table
      v-else
      :index
    />
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-chart']"
    :title="`Win-loss index for ${formatName.capitaliseName.value} not available`"
  />
</template>
