<script setup lang="ts">
definePageMeta({ name: "tournament" })
const toast = useToast()
const formatName = useFormatName()
const paramName = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")

// API call
const { data: tournament } = await useFetch<TournamentDetails>("/api/tournamentDetails", {
  query: { tid },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching tournament data",
      icon: ICONS.error,
      description: error?.message
    })
  }
})

const tournamentName = computed(() => tournament.value?.tournament.name ?? paramName.value)
formatName.name.value = tournamentName.value
useHead({ title: formatName.capitaliseName, templateParams: { subPage: null } })

const websiteLink = computed(() => {
  if (tournament.value?.tournament.website) {
    return [
      {
        color: "secondary",
        icon: ICONS.website,
        target: "_blank",
        to: tournament.value.tournament.website,
        variant: "link"
      }
    ]
  }
  return []
})

// Anchor links for right sidebar - computed to avoid hydration mismatch
const links = computed(() => {
  if (tournament.value) {
    return tournament.value.events.map(event => ({
      label: event.year,
      to: `#${event.year}`
    }))
  }
  return []
})
</script>

<template>
  <u-page>
    <!--@vue-expect-error-->
    <u-page-header
      headline="Tournaments"
      :title="formatName.capitaliseName.value"
      :description="tournament?.tournament?.years"
      :links="websiteLink"
    />

    <u-page-body>
      <u-container
        v-if="tournament && tournament.events.length > 0"
        class="flex flex-col w-full gap-10"
      >
        <u-page-grid class="xl:!grid-cols-3">
          <u-page-feature title="Sponsors">
            <template #description>
              <template v-if="tournament.names[0].name === null">—</template>
              <div
                v-else
                class="flex flex-col"
              >
                <div
                  v-for="name in tournament.names"
                  :key="name.start"
                >
                  {{ name.name }} ({{ name.start }} - {{ name.end }})
                </div>
              </div>
            </template>
          </u-page-feature>

          <u-page-feature title="Venues">
            <template #description>
              <div class="flex flex-col">
                <div
                  v-for="venue in tournament.venues"
                  :key="venue.start"
                >
                  {{ venue.venue }}, {{ venue.city }} <flag-icon :country="venue.country" /> ({{ venue.start }} - {{ venue.end }})
                </div>
              </div>
            </template>
          </u-page-feature>

          <!--XXX: Add surfaces-->
        </u-page-grid>

        <u-page-grid>
          <tournament-card
            v-for="event in tournament.events"
            :key="event.eid"
            :event
          />
        </u-page-grid>
      </u-container>

      <error-message
        v-else
        :icon="ICONS['no-calendar']"
        :title="`No details about ${formatName.capitaliseName.value} available`"
      />
    </u-page-body>

    <template #right>
      <u-page-aside>
        <div class="text-lg mb-2 text-slate-400 font-semibold"> On this page </div>
        <anchor-links :links />
      </u-page-aside>
    </template>
  </u-page>
</template>
