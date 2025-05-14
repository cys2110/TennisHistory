<script setup lang="ts">
const { id, type, tournament, country, year, match_no } = defineProps<{
  id?: string
  type: string
  tournament?: Pick<TournamentInterface, "id" | "name">
  country?: CountryInterface
  year?: string
  match_no?: string
}>()

const linkParams = computed(() => {
  if (type === "match") {
    return { id: tournament?.id, name: encodeName(tournament?.name ?? ""), year, eid: id, mid: match_no }
  } else if (id) {
    return { id: encodeName(id) }
  } else if (tournament) {
    return { id: tournament.id, name: encodeName(tournament.name) }
  } else if (country) {
    return { id: country.id }
  } else {
    return {}
  }
})
</script>

<template>
  <u-link
    class="w-fit flex"
    :class="{ 'hover-link': !country }"
    :to="{ name: type, params: linkParams }"
    active-class="text-secondary"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
    <template v-else-if="country">
      <u-icon :name="country.alpha2 ? `flag:${country.alpha2}-4x3` : `flags:${country.id}`" />
    </template>
    <template v-else>
      {{ id ?? tournament?.name }}
    </template>
  </u-link>
</template>
