<script setup lang="ts">
const { id, type, tournament } = defineProps<{
  id?: string
  type: string
  tournament?: Pick<TournamentInterface, "id" | "name">
}>()

const linkParams = computed(() => {
  if (id) {
    return { id: encodeName(id) }
  } else if (tournament) {
    return { id: tournament.id, name: encodeName(tournament.name) }
  } else {
    return {}
  }
})
</script>

<template>
  <u-link
    class="hover-link w-fit"
    :to="{ name: type, params: linkParams }"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else>
      {{ id ?? tournament?.name }}
    </template>
  </u-link>
</template>
