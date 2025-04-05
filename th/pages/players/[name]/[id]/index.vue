<script setup lang="ts">
definePageMeta({ name: "player" })
const toast = useToast()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const playerYears = useState<number[]>("player-years")
const currentYear = new Date().getFullYear()

// API call
const { data: player } = await useFetch<Pick<PlayerInterface, "gladiator" | "country">>("/api/player-overview", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching overview for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <u-page-section
        :headline="playerYears[playerYears.length - 1] === currentYear ? 'Active' : 'Retired'"
        :icon="`flag:${player?.country.alpha2}-4x3`"
        :description="`Years active: ${playerYears[0]} - ${playerYears[playerYears.length - 1] === currentYear ? 'present' : playerYears[playerYears.length - 1]}`"
        orientation="horizontal"
        reverse
      >
        <nuxt-img
          v-if="player?.gladiator"
          :src="`https://www.atptour.com/-/media/alias/player-gladiator-headshot/${id}`"
          :alt="name"
        />
        <nuxt-img
          v-else
          :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
          :alt="name"
          class="border border-neutral-500 rounded-full"
        />
      </u-page-section>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <player-details />
        <major-results />
      </div>
    </nuxt-layout>
  </div>
</template>
