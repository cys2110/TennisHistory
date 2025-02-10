<script setup lang="ts">
const toast = useToast()
const id = useRouteParams<string>("id")
const formatName = useFormatName()

// API call
const { data: results } = await useFetch<MajorResultsType[]>("/api/majorResults", {
  query: { id },
  onResponseError: error => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s major results`,
      icon: ICONS.error,
      description: error.error?.message
    })
  }
})
</script>

<template>
  <u-page-section title="Best Results">
    <template
      #features
      v-if="results"
    >
      <u-page-feature
        v-for="result in results"
        :key="result.tid"
        :title="`${result.name} — ${result.round}`"
        :to="{ name: 'tournament', params: { name: useChangeCase(result.name, 'kebabCase').value, tid: result.tid } }"
      >
        <template #description>
          <div class="flex flex-col gap-2 w-fit">
            <nuxt-link
              v-for="event in result.events"
              :key="event.year"
              class="hover-link"
              :to="{ name: 'event', params: { name: useChangeCase(result.name, 'kebabCase').value, eid: event.eid, tid: result.tid, year: event.year } }"
            >
              {{ event.year }}
            </nuxt-link>
          </div>
        </template>
      </u-page-feature>
    </template>
    <template
      #description
      v-else
    >
      <error-message
        :icon="ICONS['no-trophy']"
        :title="`No results for ${formatName.capitaliseName.value} available`"
      />
    </template>
  </u-page-section>
</template>
