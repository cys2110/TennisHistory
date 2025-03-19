<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data: seeds } = await useFetch<SeedType[]>("/api/event-seeds", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching seeds for ${formatName.capitaliseName.value} ${year.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="h-(--ui-header-height) flex items-center border-b border-(--ui-border) px-4 sm:px-6 gap-2 mb-5">
      <u-icon
        name="solar:ranking-line-duotone"
        class="text-(--ui-text-highlighted)"
      />
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Seeds</h1>
    </div>

    <seeds-table
      v-if="seeds && checked"
      :seeds
    />

    <seeds-chart
      v-else-if="seeds"
      :seeds
    />

    <error-message
      v-else
      :icon="ICONS['no-info']"
      :title="`No seeds found for ${formatName.capitaliseName.value} ${year}`"
    />
  </div>
</template>
