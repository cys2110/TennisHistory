<script setup lang="ts">
definePageMeta({ name: "event", layout: "event-layout" })
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const toast = useToast()
const formatName = useFormatName()

const { data: event } = await useFetch<EventDetailsType>("/api/eventDetails", {
  query: { id: eid.value },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${formatName.capitaliseName.value} ${year.value}`,
      icon: ICONS.error,
      description: error?.message
    })
  }
})
</script>

<template>
  <event-overview
    v-if="event"
    :event
  />
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No details about ${formatName.capitaliseName.value} ${year} available`"
  />

  <u-page-columns class="lg:!columns-2">
    <awards />
    <entry-info />
    <seeds />
    <entries />
  </u-page-columns>
</template>
