<script setup lang="ts">
const route = useRoute()
const toast = useToast()

// API call
const { data: results, status } = await useFetch<PlayerBestResultsType[]>("/api/majorResults", {
  query: { id: route.params.id },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-page-section title="Best Results">
    <template
      #features
      v-if="results || status === 'pending'"
    >
      <u-page-feature
        v-if="status === 'pending'"
        v-for="i in new Array(4)"
        :key="i"
      >
        <template #title>
          <u-skeleton class="h-6 w-48 bg-slate-700" />
        </template>
        <template #description>
          <div class="flex flex-col gap-2">
            <u-skeleton class="h-4 w-24 bg-slate-700" />
            <u-skeleton class="h-4 w-24 bg-slate-700" />
          </div>
        </template>
      </u-page-feature>
      <u-page-feature
        v-else
        v-for="result in results"
        :key="result.tid"
      >
        <template #title>
          <nuxt-link
            class="hover-link"
            :to="{ name: 'tournament', params: { name: useChangeCase(result.tname, 'kebabCase').value, tid: result.tid } }"
          >
            {{ result.tname }}
          </nuxt-link>
          — {{ result.round }}
        </template>
        <template #description>
          <div
            v-for="event in result.events"
            :key="event.year"
          >
            <nuxt-link
              class="hover-link"
              :to="{ name: 'event', params: { name: useChangeCase(result.tname, 'kebabCase').value, tid: result.tid, year: event.year, eid: event.eid } }"
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
      <error-message :icon="ICONS['no-trophy']">{{ useChangeCase(route.params.name as string, "capitalCase").value }}'s major results are not available</error-message>
    </template>
  </u-page-section>
</template>
