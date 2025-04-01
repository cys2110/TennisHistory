<script setup lang="ts">
definePageMeta({ name: "supervisor" })
const toast = useToast()
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Supervisors" } })

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor }, { label: name.value }])

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/supervisor-details", {
  query: { id: name.value },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name.value}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Anchor links
const links = computed(() => {
  if (events.value)
    return events.value.map(event => ({
      to: "#event-" + event.eid,
      label: event.name + " " + event.year
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <!--TOC-->
      <template #right>
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold">Events supervised by {{ name }}</div>
      </template>

      <!--Event cards-->
      <event-grid
        v-if="events && events.length > 0"
        :events="events"
      />

      <error-message
        v-else
        :icon="ICONS.noSupervisor"
        :title="`No events supervised by ${name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
