<script setup lang="ts">
const { index, country } = defineProps<{ index: number; country: CountryInterface }>()
const appConfig = useAppConfig()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))

const selectedValue = ref<{
  label: string
  value: string
  country: { id: string; name: string; alpha2: string | null }
}>({
  label: index === 1 ? p1Name.value : p2Name.value,
  value: index === 1 ? (route.params.p1Id as string) : (route.params.p2Id as string),
  country: country
})
const searchTerm = ref<string>("")

const { data: players, status } = await useFetch<
  { label: string; value: string; country: { id: string; name: string; alpha2: string | null } }[]
>("/api/h2h/player-search", {
  query: { searchTerm },
  immediate: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching players named ${searchTerm.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
  }
})

watch(
  () => selectedValue.value,
  () => {
    router.push({
      name: "h2h-players",
      params: {
        p1Name: index === 1 ? encodeName(selectedValue.value.label) : route.params.p1Name,
        p2Name: index === 2 ? encodeName(selectedValue.value.label) : route.params.p2Name,
        p1Id: index === 1 ? selectedValue.value.value : route.params.p1Id,
        p2Id: index === 2 ? selectedValue.value.value : route.params.p2Id
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
    :trailing-icon="appConfig.ui.icons.search"
    :items="players || []"
  >
    <template #item-leading="{ item }">
      <u-icon
        :name="item.country.alpha2 ? `flag:${item.country.alpha2}-4x3` : `flags:${item.country.id}`"
        class="mr-2"
      />
    </template>
  </u-select-menu>
</template>
