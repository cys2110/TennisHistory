<script setup lang="ts">
definePageMeta({ name: "event", layout: "event-layout" })
const eid = useRouteParams<string>("eid")
const name = useRouteParams<string>("name")
const year = useRouteParams<string>("year")
const toast = useToast()
const tournamentName = useTournamentName()
tournamentName.tournamentName = name.value

const { data: event, status } = await useFetch<EventDetailsType>("/api/eventDetails", {
  query: { id: eid.value },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching details about ${tournamentName.capitalisedName} ${year}`,
      icon: ICONS.error,
      description: error?.message
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
      No details about {{ tournamentName.capitalisedName }} {{ year }} available
    </error-message>

    <u-container class="my-10">
      <div class="flex justify-evenly">
        <div class="flex flex-col">
          <awards />
          <entry-info />
        </div>
        <seeds />
      </div>
      <entries />
    </u-container>
  </u-container>
</template>
