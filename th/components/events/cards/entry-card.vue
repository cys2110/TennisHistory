<script setup lang="ts">
defineProps<{ entry: Omit<EntryInterface, "incomplete" | "rank2" | "reason"> }>()
</script>

<template>
  <u-page-card
    :title="entry.name"
    :to="{ name: 'player', params: { name: encodeName(entry.name), id: entry.id } }"
    orientation="horizontal"
    reverse
    :ui="{
      leading: 'flex justify-between items-center',
      container: 'flex-row lg:flex lg:flex-row',
      wrapper: 'flex-1 order-last',
      root: 'h-full',
      footer: 'self-start'
    }"
    highlight
    :description="`Rank: ${entry.rank ?? '—'}`"
  >
    <template #leading>
      <base-link
        type="country"
        :country="entry.country"
      />
    </template>

    <div class="w-25 h-25 my-auto">
      <nuxt-img
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`"
        :alt="entry.name"
        class="rounded-full border-1 border-neutral-600 dark:border-neutral-400 mx-auto"
      />
    </div>

    <template #footer>
      <div class="flex flex-wrap gap-2">
        <u-badge
          v-if="entry.seed"
          class="bg-primary-800 text-primary-300 font-bold"
          :label="`Seed:
        ${entry.seed}`"
        />
        <u-badge
          v-if="entry.status"
          :class="STATUSES[entry.status].class"
          :label="STATUSES[entry.status].longName"
        />
        <u-badge
          v-if="entry.withdrew"
          class="bg-error-800 text-error-300 font-bold"
          :label="typeof entry.withdrew === 'boolean' ? 'Withdrew' : `Withdrew: ${entry.withdrew}`"
        />
      </div>
    </template>
  </u-page-card>
</template>
