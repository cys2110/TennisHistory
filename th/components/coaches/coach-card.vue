<script setup lang="ts">
defineProps<{ coach: { labels: string[]; id: string; name: string | null; country: CountryInterface | null } }>()
</script>

<template>
  <u-page-card
    :title="coach.name ?? coach.id"
    :to="{ name: 'coach', params: { id: encodeName(coach.id) } }"
    highlight
    :ui="{ container: 'justify-center items-center text-center', wrapper: 'flex flex-row items-center gap-2', leading: 'mb-0 gap-2' }"
  >
    <template
      #leading
      v-if="coach.labels.includes('Player')"
    >
      <country-link
        v-if="coach.country"
        :country="coach.country"
      />
      <u-avatar
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${coach.id}`"
        :alt="coach.name ?? ''"
        class="border border-neutral-500"
      />
    </template>
  </u-page-card>
</template>
