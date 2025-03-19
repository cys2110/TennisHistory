<script setup lang="ts">
definePageMeta({
  name: "country-tournament",
  layout: "dashboard-layout"
})
const formatName = useFormatName()
const toast = useToast()
const paramName = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")

// API call
const { data: tournament } = await useFetch<Pick<TournamentInterface, "id" | "name" | "website" | "years">>("/api/tournament-name", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${useChangeCase(paramName.value, "capitalCase").value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

formatName.name.value = tournament.value?.name ?? paramName.value
useHead({
  title: tournament.value?.name ?? formatName.capitaliseName,
  templateParams: { subPage: null }
})

// Breadcrumbs
const items = computed(() => [{ label: "Tournaments", to: { name: "tournaments" } }, { label: tournament.value?.name ?? formatName.capitaliseName.value }])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel class="max-h-screen">
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>
          <template #title>
            <u-breadcrumb :items />
          </template>
          <template #right>
            <u-button
              v-if="tournament?.website"
              :to="tournament.website"
              target="_blank"
              label="Website"
              :icon="ICONS.website"
            />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-header
          headline="Tournaments"
          :title="tournament?.name ?? formatName.capitaliseName.value"
          :description="tournament?.years"
        />

        <country-grid />
      </template>
    </u-dashboard-panel>
  </div>
</template>
