<script setup lang="ts">
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()

// API call
const { data: results, status } = await useFetch("/api/major-results", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name.value}'s best results`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <dashboard-subpanel title="Best Results">
    <u-page-columns
      v-if="results"
      class="lg:columns-2 2xl:columns-2"
    >
      <u-page-card
        v-for="result in results"
        :key="result.tid"
        :title="result.name"
        spotlight
        variant="outline"
        :ui="{ description: 'flex flex-col gap-1' }"
      >
        <template #title>
          <tournament-link
            :name="result.name"
            :id="result.tid"
          />
          — {{ result.round }}
        </template>

        <template #description>
          <event-link
            v-for="event in result.events"
            :key="event.year"
            :name="result.name"
            :tid="result.tid"
            :eid="event.eid"
            :year="event.year"
          >
            {{ event.year }}
          </event-link>
        </template>
      </u-page-card>
    </u-page-columns>
    <error-message
      v-else
      :icon="ICONS.noTournament"
      :title="`No results found for ${name}`"
      :status
    />
  </dashboard-subpanel>
</template>
