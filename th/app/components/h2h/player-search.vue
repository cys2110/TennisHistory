<script setup lang="ts">
const { index, player } = defineProps<{ index: number; player: PlayerInterface }>()
const {
  ui: { icons }
} = useAppConfig()
const {
  params: { p1Name, p2Name, p1Id, p2Id }
} = useRoute("head-to-head")

const selectedPlayer = ref<{ label: string; value: string; country: CountryInterface }>({
  label: `${player.first_name} ${player.last_name}`,
  value: player.id,
  country: player.country
})
const searchTerm = ref<string>("")

const { data, status, refresh } = await useFetch<PersonInterface[]>("/api/players/search", {
  query: { searchTerm },
  watch: false,
  lazy: true,
  immediate: false
})

const options = computed(() => data.value?.map(p => ({ label: p.first_name + " " + p.last_name, value: p.id, country: p.country })) || [])

watch(searchTerm, () => {
  if (searchTerm.value !== "") refresh()
})

watch(selectedPlayer, async () => {
  await navigateTo({
    name: "head-to-head",
    params: {
      p1Name: index === 1 ? kebabCase(selectedPlayer.value?.label || "") : p1Name,
      p2Name: index === 2 ? kebabCase(selectedPlayer.value?.label || "") : p2Name,
      p1Id: index === 1 ? selectedPlayer.value?.value : p1Id,
      p2Id: index === 2 ? selectedPlayer.value?.value : p2Id
    }
  })
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
    :items="options"
    variant="none"
    class="w-1/4"
  >
    <template #item-leading="{ item }">
      <u-icon
        :name="getFlagCode(item.country)"
        class="mr-2"
      />
    </template>
  </u-select-menu>
</template>
