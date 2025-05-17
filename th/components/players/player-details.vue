<script setup lang="ts">
import { PlayerDetailsGrid, PlayerDetailsTable } from "#components"

const { active } = defineProps<{ active: boolean }>()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.name as string))
const currentYear = new Date().getFullYear()

// API call
const { data: player, status } = await useFetch<PlayerDetailsType>("/api/players/details", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const playerDetails = computed(() => {
  if (player.value) {
    return [
      { title: "Career High", value: player.value.ch ?? "—", description: player.value.ch_date ?? undefined },
      { title: "Win-Loss", value: `${player.value.wins}—${player.value.losses}` },
      { title: "Titles", value: player.value.titles },
      { title: "Prize Money", value: `$${player.value.pm}` },
      {
        title: "Age",
        value: player.value.age ? `${player.value.age} years` : "Unknown",
        description: player.value.dod ? `${player.value.dob} - ${player.value.dod}` : player.value.dob ?? undefined
      },
      player.value.turned_pro || player.value.retired
        ? {
            title: player.value.turned_pro && (player.value.retired || active) ? "Career span" : player.value.turned_pro ? "Turned pro" : "Retired",
            value:
              player.value.turned_pro && player.value.retired
                ? `${player.value.turned_pro} - ${player.value.retired}`
                : player.value.turned_pro && active
                ? `${player.value.turned_pro} - present`
                : player.value.turned_pro || player.value.retired,
            description:
              active && player.value.turned_pro
                ? `${currentYear - player.value.turned_pro} years`
                : player.value.turned_pro && player.value.retired
                ? `${player.value.retired - player.value.turned_pro} years`
                : undefined
          }
        : null,
      {
        title: "Height",
        value: player.value.height ? `${player.value.height} cm (${convertToFt(player.value.height)})` : "Unknown"
      },
      { title: "Plays", value: player.value.rh ? handedness(player.value.rh) : "Unknown" },
      { title: "Backhand", value: player.value.bh ? `${player.value.bh}-Handed` : "Unknown" },
      player.value.hof ? { title: "Hall of Fame Induction", value: player.value.hof } : null
    ].filter(Boolean) as { title: string; value: any; description?: string }[]
  }
  return []
})
</script>

<template>
  <dashboard-subpanel
    title="Details"
    :icon="ICONS.overview"
  >
    <component
      :is="viewMode === 'cards' ? PlayerDetailsGrid : PlayerDetailsTable"
      :key="viewMode"
      :player-details="playerDetails"
      :status
      :active
      :coaches="player?.coaches"
      :countries="player?.countries"
    />
  </dashboard-subpanel>
</template>
