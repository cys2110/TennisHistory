<script setup lang="ts">
const { index, country } = defineProps<{ index: number; country: CountryInterface }>()
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const p1ParamName = useRouteParams<string>("p1Name")
const p2ParamName = useRouteParams<string>("p2Name")
const p1Name = computed(() => decodeName(p1ParamName.value))
const p2Name = computed(() => decodeName(p2ParamName.value))
const router = useRouter()

const selectedValue = ref<{ label: string; value: string; country: { id: string; name: string; alpha2: string | null } }>({
  label: index === 1 ? p1Name.value : p2Name.value,
  value: index === 1 ? p1Id.value : p2Id.value,
  country: country
})
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
        p1Name: index === 1 ? encodeName(selectedValue.value.label) : p1ParamName.value,
        p2Name: index === 2 ? encodeName(selectedValue.value.label) : p2ParamName.value,
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
      <u-icon
        :name="`flag:${item.country.alpha2}-4x3`"
        class="mr-2"
      />
    </template>
  </u-select-menu>
</template>
