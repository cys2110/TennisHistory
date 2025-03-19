<script setup lang="ts">
definePageMeta({
  name: "tournament",
  layout: "dashboard-layout",
  middleware: [
    function (to, from) {
      if (["8888", "9900"].includes(to.params.tid as string)) {
        return navigateTo({ name: "country-tournament" })
      }
    }
  ]
})
const formatName = useFormatName()
const toast = useToast()
const paramName = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
const selectedTab = ref("winners")
const tabs = [
  { label: "Winners", value: "winners", icon: ICONS.trophy },
  { label: "By the Numbers", value: "numbers", icon: ICONS["line-scatter"] }
]

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

        <u-dashboard-toolbar class="w-full">
          <u-tabs
            v-model="selectedTab"
            :items="tabs"
            class="w-fit"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-header
          headline="Tournaments"
          :title="tournament?.name ?? formatName.capitaliseName.value"
          :description="tournament?.years"
        />
        <tournament-details v-if="selectedTab === 'winners'" />
        <tournament-numbers v-else />
      </template>
    </u-dashboard-panel>
  </div>
</template>
