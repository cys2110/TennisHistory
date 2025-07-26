<script setup lang="ts">
const { icons } = useAppConfig()
const page = ref(1)
const letter = defineModel<string | undefined>()
const skip = defineModel<number>("skip")

watch(
  () => [letter, skip],
  () => (page.value = 1)
)

// API call
const { data, status } = await useFetch<{ count: number; coaches: PersonInterface[] }>("/api/coaches", {
  key: `coaches-${letter}-${skip}-${page}`,
  query: { letter, skip, page },
  default: () => ({ count: 0, coaches: [] })
})
</script>

<template>
  <u-page-grid
    v-if="data.count || status === 'pending'"
    class="xl:grid-cols-4 2xl:grid-cols-5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 md:gap-8 scroll-smooth"
  >
    <u-page-card
      v-if="data.count"
      v-for="coach in data.coaches"
      :key="coach.id"
      :to="{ name: 'coach', params: { id: kebabCase(coach.id) } }"
      :title="`${coach.first_name} ${coach.last_name}`"
      highlight
      highlight-color="joint"
      :ui="{ body: 'w-full mx-auto', title: 'text-center' }"
    />
    <loading-base
      v-else
      v-for="_ in 8"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="icons.noPeople"
    message="No coaches found"
  />
  <u-pagination
    v-if="data.count"
    v-model:page="page"
    :total="data.count"
    :items-per-page="skip"
    variant="ghost"
    color="primary"
    active-variant="subtle"
    class="mx-auto mt-auto"
  />
</template>
