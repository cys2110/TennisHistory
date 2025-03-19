<script setup lang="ts">
const id = useRouteParams<string>("id")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data: results, error } = await useFetch<MajorResultsInterface[]>("/api/major-results", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s best results`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-1.5 mb-5">
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Best Results</h1>
    </div>
    <u-page-grid
      v-if="results"
      class="lg:grid-cols-2 2xl:grid-cols-2"
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
            :tid="result.tid"
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
    </u-page-grid>
    <error-message
      v-else
      :icon="ICONS['no-trophy']"
      :title="`No results found for ${formatName.capitaliseName.value}`"
    />
  </div>
</template>
