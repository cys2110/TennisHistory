<script setup lang="ts">
definePageMeta({ name: "wl-index", layout: "player-layout" })
const route = useRoute()
const toast = useToast()
const checked = ref(false)

const { data: wlIndex, status } = await useFetch<PlayerWLIndexType[]>("/api/wlIndex", {
  query: { id: route.params.id },
  transform: (data: Pick<PlayerWLIndexType, "category" | "stat" | "wins" | "losses" | "titles">[]) => {
    return data.map(indice => ({
      ...indice,
      wins: indice.wins,
      losses: indice.losses,
      titles: indice.titles || null,
      value: indice.wins === "0" && indice.losses === "0" ? 0 : parseFloat((parseInt(indice.wins) / (parseInt(indice.wins) + parseInt(indice.losses))).toFixed(3))
    }))
  },
  onResponseError: ({ response }) => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container>
    <u-switch
      v-model="checked"
      :checked-icon="ICONS['line-scatter']"
      :unchecked-icon="ICONS.table"
    />
    <u-container v-if="wlIndex">
      <!--TODO: Add skeleton table-->
      <wlindex-chart
        v-if="checked"
        :index="wlIndex"
      />
      <wl-index-table
        v-else
        :index="wlIndex"
      />
    </u-container>
    <error-message
      v-else
      :icon="ICONS['no-chart']"
    >
      Win-loss index for {{ useChangeCase(route.params.name as string, "capitalCase") }} not available
    </error-message>
  </u-container>
</template>
