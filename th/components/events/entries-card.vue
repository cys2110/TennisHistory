<script setup lang="ts">
defineProps<{ entries: EntryTableType[] }>()
</script>

<template>
  <u-page-grid class="my-5 xl:grid-cols-5 2xl:grid-cols-6">
    <u-page-card
      v-for="entry in entries"
      :key="entry.id"
      :title="entry.name"
      :to="{ name: 'player', params: { name: encodeName(entry.name), id: entry.id } }"
      reverse
      highlight
      :description="`Rank: ${entry.rank ?? '—'}`"
      :ui="{ wrapper: 'items-center text-center' }"
    >
      <template #leading>
        <country-link :country="entry.country" />
      </template>

      <nuxt-img
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`"
        :alt="entry.name"
        class="rounded-full border-1 border-slate-500 mx-auto"
        sizes="20px"
      />

      <template #footer>
        <div class="flex gap-2">
          <u-badge
            v-if="entry.seed"
            class="bg-primary-800 text-primary-300"
            :label="`Seed: ${entry.seed}`"
          />
          <u-badge
            v-if="entry.status"
            :class="STATUSES[entry.status].class"
            :label="STATUSES[entry.status].longName"
          />
          <u-badge
            v-if="entry.withdrew"
            class="bg-error-800 text-error-300"
            :label="typeof entry.withdrew === 'boolean' ? 'Withdrew' : `Withdrew: ${entry.withdrew}`"
          />
        </div>
      </template>
    </u-page-card>
  </u-page-grid>
</template>
