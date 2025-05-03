<script setup lang="ts">
defineProps<{
  results: CoachesAPIResponseType
  status: "success" | "pending" | "idle" | "error"
}>()
</script>

<template>
  <u-page-list>
    <u-page-card
      v-for="coach in results.coaches"
      :key="coach.id"
      variant="subtle"
      :ui="{ root: 'rounded-none', description: 'flex gap-2 items-center justify-center' }"
      :to="{ name: 'coach', params: { id: encodeName(coach.id) } }"
    >
      <template #description>
        <country-link
          v-if="coach.country"
          :country="coach.country"
        />
        <u-user
          :name="coach.name ?? coach.id"
          :avatar="{
            src: `https://www.atptour.com/-/media/alias/player-headshot/${coach.id}`,
            alt: coach.name ?? ''
          }"
          :ui="{ name: 'font-bold text-base' }"
        />
      </template>
    </u-page-card>
  </u-page-list>
</template>
