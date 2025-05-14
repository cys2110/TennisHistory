<script setup lang="ts">
const { type, id, surface, country, tournament } = defineProps<{
  type: string
  id?: string
  surface?: SurfaceInterface
  country?: CountryInterface
  tournament?: Pick<TournamentInterface, "id" | "name" | "years">
}>()

const linkParams = computed(() => {
  if (surface) {
    return { id: encodeName(surface?.id) }
  } else if (country && type === "country") {
    return { id: country.id }
  } else if (tournament) {
    return { id: tournament.id, name: encodeName(tournament.name) }
  } else if (id) {
    return { id: encodeName(id) }
  }
})
</script>

<template>
  <u-page-card
    :to="{ name: type, params: linkParams }"
    highlight
    reverse
    :ui="{ body: 'mx-auto', title: 'text-center', container: 'items-center', description: 'text-center' }"
  >
    <template #title>
      <template v-if="country">
        <div class="flex items-center gap-2">
          <u-icon :name="country?.alpha2 ? `flag:${country.alpha2}-4x3` : `flags:${country.id}`" />
          <span v-if="type === 'country'">{{ country.name }}</span>
          <slot v-else />
        </div>
      </template>
      <template v-else>{{ surface?.id ?? tournament?.name ?? id }}</template>
    </template>

    <template
      #description
      v-if="tournament"
      >{{ tournament.years }}</template
    >

    <nuxt-img
      v-if="surface"
      :src="`/surfaces/${surface.surface}.jpg`"
      :alt="surface.id"
      class="opacity-75 rounded-lg"
    />
  </u-page-card>
</template>
