<script setup lang="ts">
const toast = useToast()
const id = useRouteParams<string>("id")
const name = useRouteParams<string>("name")

// API call
const { data: results, status, error } = await useFetch<PlayerBestResultsType[]>("/api/majorResults", { query: { id } })

// Error handling
whenever(error, () => {
  toast.add({
    title: "Error fetching player's best results",
    icon: ICONS.error,
    description: `${error.value}`
  })
})
</script>

<template>
  <u-page-section title="Best Results">
    <template
      #features
      v-if="results || status === 'pending'"
    >
      <!--Loading skeleton-->
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
      <error-message :icon="ICONS['no-trophy']">{{ useChangeCase(name, "capitalCase").value }}'s major results are not available</error-message>
    </template>
  </u-page-section>
</template>
