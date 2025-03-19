<script setup lang="ts">
const { index, name, country } = defineProps<{ index: number; name: string; country: CountryInterface }>()
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const router = useRouter()

const selectedValue = ref<{ label: string; value: string; country: { id: string; name: string; alpha2: string | null } }>({ label: name, value: index === 1 ? p1Id.value : p2Id.value, country: country })
const searchTerm = ref<string>("")

const { data: players, status } = await useFetch<{ label: string; value: string; country: { id: string; name: string; alpha2: string | null } }[]>("/api/player-search", {
  query: { searchTerm },
  immediate: false
})

watch(
  () => selectedValue.value,
  () => {
    router.push({
      name: "h2h-players",
      params: {
        p1Name: index === 1 ? useChangeCase(selectedValue.value.label, "kebabCase").value : p1Id.value,
        p2Name: index === 2 ? useChangeCase(selectedValue.value.label, "kebabCase").value : p2Id.value,
        p1Id: index === 1 ? selectedValue.value.value : p1Id.value,
        p2Id: index === 2 ? selectedValue.value.value : p2Id.value
      }
    })
  },
  { immediate: false }
)
</script>

<template>
  <u-select-menu
    v-model="selectedValue"
    v-model:search-term="searchTerm"
    :icon="`flag:${selectedValue.country.alpha2}-4x3`"
    :loading="status === 'pending'"
    :trailing-icon="ICONS.search"
    :items="players || []"
  >
    <template #item-leading="{ item }">
      <flag-icon :country="item.country" />
    </template>
  </u-select-menu>
</template>
