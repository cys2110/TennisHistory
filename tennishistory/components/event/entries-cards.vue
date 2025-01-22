<script setup lang="ts">
import { StatusEnum } from "~/types/enums"

defineProps<{ entries: EventEntryType[] }>()

const statusColours: Record<StatusEnum, string> = {
  [StatusEnum.LL]: "bg-red-300 !text-red-800",
  [StatusEnum.Alt]: "bg-amber-300 !text-amber-800",
  [StatusEnum.Q]: "bg-emerald-300 !text-green-800",
  [StatusEnum.WC]: "bg-blue-300 !text-blue-800",
  [StatusEnum.SE]: "bg-fuchsia-300 !text-fuchsia-800",
  [StatusEnum.PR]: "bg-teal-300 !text-teal-800"
}
</script>

<template>
  <u-page-grid>
    <u-page-card
      v-for="entry in entries"
      :key="entry.id"
      :icon="`flag:${COUNTRY_CODES[entry.country_id]}-4x3`"
    >
      <template #title>
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(entry.name, 'kebabCase').value, id: entry.id } }"
        >
          {{ entry.name }}
        </nuxt-link>
      </template>
      <template #description>Rank: {{ entry.rank }}</template>

      <template #footer>
        <u-badge
          v-if="entry.seed"
          class="bg-green-800 text-green-300"
          :label="`Seed: ${entry.seed}`"
        />
        <u-badge
          v-if="entry.status"
          :class="statusColours[entry.status]"
          :label="`Status: ${STATUS_INFO[entry.status]}`"
        />
      </template>
    </u-page-card>
  </u-page-grid>
</template>
