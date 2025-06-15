<script setup lang="ts">
const { index, country, name, id } = defineProps<{
  index?: number
  country?: CountryInterface
  name?: string
  id?: string
}>()

const {
  ui: { icons }
} = useAppConfig()
const route = useRoute()
const router = useRouter()

const selectedPlayer = ref<{ label: string; value: string; country: CountryInterface } | undefined>(
  country ? { label: name || "", value: id || "", country } : undefined
)
const searchTerm = ref<string>("")

const player = defineModel<string | undefined>()

// API call
const {
  data: players,
  status,
  refresh
} = await useFetch<{ label: string; value: string; country: CountryInterface }[]>("/api/players/search", {
  query: { searchTerm },
  watch: false,
  lazy: true,
  immediate: false
})

watch(searchTerm, () => {
  if (searchTerm.value !== "") refresh()
})

watch(selectedPlayer, () => {
  if (route.name === "umpire" && selectedPlayer.value) {
    player.value = selectedPlayer.value.value
  } else {
    router.push({
      name: "h2h-players",
      params: {
        p1Name: index === 1 ? encodeName(selectedPlayer.value?.label || "") : route.params.p1Name,
        p2Name: index === 2 ? encodeName(selectedPlayer.value?.label || "") : route.params.p2Name,
        p1Id: index === 1 ? selectedPlayer.value?.value : route.params.p1Id,
        p2Id: index === 2 ? selectedPlayer.value?.value : route.params.p2Id
      }
    })
  }
})
</script>

<template>
  <u-select-menu
    v-model="selectedPlayer"
    v-model:search-term="searchTerm"
    placeholder="Search for a player"
    :icon="selectedPlayer ? getFlagCode(selectedPlayer.country) : undefined"
    :loading="status === 'pending'"
    :trailing-icon="icons.search"
    :items="players || []"
    variant="none"
  >
    <template #item-leading="{ item }">
      <u-icon
        :name="getFlagCode(item.country)"
        class="mr-2"
      />
    </template>
  </u-select-menu>
</template>
