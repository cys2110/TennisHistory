<script setup lang="ts">
defineProps<{ checked: boolean }>()
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data: awards } = await useFetch<RoundInterface[]>("/api/event-awards", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching awards for ${formatName.capitaliseName.value} ${year.value}`,
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
        name="tdesign:money"
        class="text-(--ui-text-highlighted)"
      />
      <h1 class="flex items-center gap-1.5 font-semibold text-(--ui-text-highlighted)">Awards</h1>
    </div>

    <awards-table
      v-if="awards && checked"
      :awards
    />

    <awards-chart
      v-else-if="awards"
      :awards
    />

    <error-message
      v-else
      icon="material-symbols-light:money-off"
      :title="`No awards found for ${formatName.capitaliseName.value} ${year}`"
    />
  </div>
</template>
