<script setup lang="ts">
defineProps<{ ages: WinnersByAgeInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid
    v-if="ages.length || ['pending', 'idle'].includes(status)"
    class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    <u-page-card
      v-if="ages.length"
      v-for="age in ages"
      :key="age.year"
      :ui="{ description: 'font-semibold text-sm', body: 'w-full', title: 'flex items-center gap-5 justify-between' }"
    >
      <template #title>
        <u-link
          class="hover-link w-fit"
          :to="{ name: 'event', params: { id: route.params.id as string, name: route.params.name as string, eid: age.id, year: age.year } }"
        >
          {{ age.year }}
        </u-link>
        <player-avatar
          :player="age.player"
          bold
        />
      </template>

      <template #description>
        {{ age.age }}
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
    :icon="ICONS.noCalendar"
    :message="`No winners by age found for ${name}`"
  />
</template>
