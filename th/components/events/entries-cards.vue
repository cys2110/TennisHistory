<script setup lang="ts">
defineProps<{ entries: EventEntryType[] }>()

const statusColours: Record<StatusType, string> = {
  LL: "bg-red-300 !text-red-800",
  AL: "bg-amber-300 !text-amber-800",
  Q: "bg-emerald-300 !text-green-800",
  WC: "bg-blue-300 !text-blue-800",
  SE: "bg-fuchsia-300 !text-fuchsia-800",
  PR: "bg-yellow-300 !text-yellow-800"
}
</script>

<template>
  <u-page-grid class="p-5 lg:!grid-cols-2 xl:!grid-cols-3">
    <u-page-card
      v-for="entry in entries"
      :key="entry.id"
      :title="entry.name"
      :to="{ name: 'player', params: { name: useChangeCase(entry.name, 'kebabCase').value, id: entry.id } }"
      variant="subtle"
      highlight
      reverse
      :description="`Rank: ${entry.rank ?? '—'}`"
      :ui="{ root: 'ring-teal-600 shadow-teal-800 hover:shadow-teal-800 dark:shadow-teal-400 dark:hover:shadow-teal-400', wrapper: 'items-center text-center' }"
    >
      <template #leading>
        <flag-icon :country="entry.country" />
      </template>

      <nuxt-img
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`"
        :alt="entry.name"
        class="rounded-full border-1 border-slate-500 mx-auto"
        sizes="20px"
      />

      <template #footer>
        <u-badge
          v-if="entry.seed"
          class="bg-violet-800 text-violet-300"
          :label="`Seed: ${entry.seed}`"
        />
        <u-badge
          v-if="entry.status"
          :class="statusColours[entry.status]"
          :label="`Status: ${sTATUSINFO[entry.status]}`"
        />
      </template>
    </u-page-card>
  </u-page-grid>
</template>
