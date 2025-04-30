<script setup lang="ts">
definePageMeta({ name: "player" })
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const playerYears = useState<string[]>("player-years")

// Determine whether player is still active on tour
const active = computed(() => {
  if (playerYears.value.length > 0) {
    const lastYear = playerYears.value[playerYears.value.length - 1]
    return Number(lastYear) === new Date().getFullYear()
  }
  return false
})

// API call
const { data: player, refresh } = await useFetch<Pick<PlayerInterface, "gladiator" | "country">>(
  "/api/players/overview",
  {
    query: { id },
    watch: false,
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching player overview for ${name.value}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

watch(
  () => id.value,
  newId => {
    if (newId && route.name === "player") refresh()
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <u-page-section
        :headline="active ? 'Active' : 'Retired'"
        :title="name"
        orientation="horizontal"
        reverse
        :ui="{ title: 'tracking-wider uppercase' }"
      >
        <nuxt-img
          :src="
            player?.gladiator
              ? `https://www.atptour.com/-/media/alias/player-gladiator-headshot/${id}`
              : `https://www.atptour.com/-/media/alias/player-headshot/${id}`
          "
          :alt="name"
          :class="{
            'border border-neutral-500 rounded-full max-h-96 max-w-96 mx-auto': !player?.gladiator
          }"
        />

        <template #leading>
          <country-link
            v-if="player"
            :country="player.country"
            class="text-2xl"
          />
        </template>

        <template #description>
          <div class="text-base">Years Active at Tour Level:</div>
          <div class="font-bold text-(--ui-text-highlighted) text-xl">
            {{ playerYears[0]
            }}{{
              playerYears.length > 1
                ? `— ${active ? "present" : playerYears[playerYears.length - 1]}`
                : undefined
            }}
          </div>
          <div class="text-base">
            {{ Number(playerYears[playerYears.length - 1]) - Number(playerYears[0]) + 1 }}
            years
          </div>
        </template>
      </u-page-section>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <player-details :active />
        <major-results />
      </div>
    </nuxt-layout>
  </div>
</template>
