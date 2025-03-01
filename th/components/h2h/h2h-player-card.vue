<script setup lang="ts">
const router = useRouter()
const { player, index } = defineProps<{ player: Pick<PlayerType, "id" | "name" | "country" | "wl" | "wl_pc" | "pm" | "rh" | "bh" | "pro" | "titles" | "dob" | "height" | "ch">; index: number }>()
const p1Name = useRouteParams<string>("p1Name")
const p2Name = useRouteParams<string>("p2Name")
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const searchTerm = ref("")
const value = ref({ label: player.name, value: player.id, country: player.country })

const playerDetails = computed(() => [
  { title: "DOB", value: player.dob ?? "Unknown" },
  { title: "Height", value: player.height ? `${player.height}cm (${convertToFt(Number(player.height))})` : "Unknown" },
  { title: "Plays", value: handedness(player.rh) },
  { title: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
  { title: "Turned pro", value: player.pro ?? "Unknown" }
])

const { data: selectOptions } = await useFetch<{ label: string; value: string; country: { id: string; name: string; alpha2: string | null } }[]>("/api/playerSearch", {
  query: { searchTerm },
  immediate: false
})

watch(
  () => value.value,
  () => {
    router.push(`/h2h/${index === 1 ? useChangeCase(value.value.label, "kebabCase").value : p1Name.value}-v-${index === 2 ? useChangeCase(value.value.label, "kebabCase").value : p2Name.value}/${index === 1 ? value.value.value : p1Id.value}-${index === 2 ? value.value.value : p2Id.value}`)
  },
  { immediate: false }
)
</script>

<template>
  <u-page-card
    :icon="`flag:${player.country.alpha2}-4x3`"
    :title="player.name"
    highlight
    reverse
    :ui="{ body: 'w-full' }"
  >
    <nuxt-img
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
      :alt="player.name"
      class="rounded-full border-1 border-slate-500 mx-auto"
      sizes="20px"
    />

    <template #description>
      <u-page-list>
        <div
          v-for="detail in playerDetails"
          :key="detail.title"
          class="flex justify-between items-center"
        >
          <span>{{ detail.title }}</span>
          <span class="font-semibold">{{ detail.value }}</span>
        </div>
      </u-page-list>
    </template>

    <template #footer>
      <u-select-menu
        v-model="value"
        v-model:search-term="searchTerm"
        :icon="ICONS.search"
        :items="selectOptions || []"
      >
        <template #item-leading="{ item }">
          <flag-icon :country="item.country" />
        </template>
      </u-select-menu>
    </template>
  </u-page-card>
</template>
