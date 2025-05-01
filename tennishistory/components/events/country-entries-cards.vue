<script setup lang="ts">
defineProps<{ entry: CountryEntryType }>()
</script>

<template>
  <u-page-card
    :title="entry.name"
    :to="{ name: 'player', params: { name: encodeName(entry.name), id: entry.id } }"
    reverse
    highlight
    :description="`Rank: ${entry.rank ?? '—'}`"
    :ui="{ wrapper: 'items-center text-center' }"
    class="h-72"
  >
    <nuxt-img
      :src="`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`"
      :alt="entry.name"
      class="rounded-full border-1 border-slate-500 mx-auto max-h-40"
      sizes="20px"
    />
  </u-page-card>
</template>
