<script setup lang="ts">
definePageMeta({ name: "event", layout: "event-layout" })
const route = useRoute()
const toast = useToast()

const { data: event, status } = await useFetch<EventDetailsType>("/api/eventDetails", {
  query: { id: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container>
    <event-overview
      v-if="event"
      :event
    />
    <error-message
      v-else
      :icon="ICONS['no-info']"
    >
      No details about {{ useChangeCase(route.params.name as string, "capitalCase").value }} {{ route.params.year }} available
    </error-message>

    <u-container class="flex justify-evenly">
      <div class="flex flex-col">
        <awards />
        <entry-info />
      </div>
      <seeds />
    </u-container>

    <u-container>
      <entries />
    </u-container>
  </u-container>
</template>
