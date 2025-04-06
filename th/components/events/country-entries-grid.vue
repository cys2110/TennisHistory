<script setup lang="ts">
defineProps<{ entries: CountryEntryType[] }>()
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
    <u-page-card
      v-for="entry in entries"
      :key="entry.id"
      :title="entry.name"
      :to="{ name: 'player', params: { name: encodeName(entry.name), id: entry.id } }"
      reverse
      variant="outline"
      spotlight
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
  </div>
</template>
