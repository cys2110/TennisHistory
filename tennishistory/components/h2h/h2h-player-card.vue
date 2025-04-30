<script setup lang="ts">
const { player, index, id, country } = defineProps<{
  player: H2HPlayerInterface
  index: number
  id: string
  country: CountryInterface
}>()

const route = useRoute()
const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))

const playerDetails = computed(() => [
  { title: "DOB", value: player.dob ?? "Unknown" },
  {
    title: "Height",
    value: player.height ? `${player.height}cm (${convertToFt(player.height)})` : "Unknown"
  },
  { title: "Plays", value: player.rh ? handedness(player.rh) : "Unknown" },
  { title: "Backhand", value: player.bh ? `${player.bh}-Handed` : "Unknown" },
  { title: "Turned pro", value: player.turned_pro ?? "Unknown" }
])
</script>

<template>
  <u-page-card
    :title="index === 1 ? p1Name : p2Name"
    highlight
    reverse
    :ui="{
      body: 'w-full',
      root:
        index === 1
          ? 'min-w-66 ring-primary-600 dark:ring-primary-600'
          : 'min-w-66 ring-emerald-700 dark:ring-emerald-700 shadow-emerald-700 dark:shadow-emerald-500 hover:shadow-emerald-700 dark:hover:shadow-emerald-500'
    }"
    class="2xl:w-1/5"
  >
    <nuxt-img
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
      :alt="index === 1 ? p1Name : p2Name"
      class="rounded-full border-1 border-neutral-500 mx-auto"
      sizes="20px"
    />
    <template #leading>
      <country-link :country="country" />
    </template>
    <template #description>
      <div
        v-for="detail in playerDetails"
        :key="detail.title"
        class="flex justify-between items-center"
      >
        <span>{{ detail.title }}</span>
        <span class="font-semibold">{{ detail.value }}</span>
      </div>
    </template>
  </u-page-card>
</template>
