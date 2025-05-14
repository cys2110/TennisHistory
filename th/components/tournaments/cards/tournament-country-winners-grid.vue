<script setup lang="ts">
interface APIResponse {
  wins: string
  country: CountryInterface
  total_wins: string
}

defineProps<{ countries: APIResponse[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid
    v-if="countries.length || ['pending', 'idle'].includes(status)"
    class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    <u-page-card
      v-if="countries.length"
      v-for="country in countries"
      :key="country.country.id"
      :ui="{ description: 'text-sm', body: 'w-full', title: 'flex items-center gap-2' }"
    >
      <template #title>
        <base-link
          type="country"
          :country="country.country"
        />
        <base-link type="country">{{ country.country.name }}</base-link>
      </template>

      <template #description>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span>Wins by Unique Players</span>
            <span class="font-semibold">{{ country.wins }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Total Wins</span>
            <span class="font-semibold">{{ country.total_wins }}</span>
          </div>
        </div>
      </template>
    </u-page-card>
    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noCountries"
    :message="`No countries by winners found for ${name}`"
  />
</template>
