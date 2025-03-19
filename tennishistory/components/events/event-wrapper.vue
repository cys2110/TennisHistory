<script setup lang="ts">
const formatName = useFormatName()
const toast = useToast()
const paramName = useRouteParams<string>("name")
const tid = useRouteParams<string>("tid")
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const route = useRoute()

// API call
const { data: tournament } = await useFetch<{ name: string; draw_type: DrawType }>("/api/event-name", {
  query: { eid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${useChangeCase(paramName.value, "capitalCase").value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

formatName.name.value = tournament.value?.name ?? paramName.value
const currentPage = computed(() => EVENT_PAGES.find(page => page.name === route.name))
useHead({
  title: currentPage.value?.label ?? "",
  templateParams: { subPage: tournament.value?.name ?? formatName.capitaliseName.value }
})

// Breadcrumbs
const items = computed(() => [{ label: "Tournaments", to: { name: "tournaments" } }, { label: tournament.value?.name ?? formatName.capitaliseName.value }, { label: currentPage.value?.label ?? "" }])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel
      id="event"
      class="min-h-screen"
    >
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>
          <template #title>
            <u-breadcrumb :items />
          </template>
          <template #right>
            <event-page-buttons
              :name="paramName"
              :tid
              :eid
              :year
              :drawType="tournament?.draw_type ?? null"
            />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar v-if="route.name !== 'results'">
          <template
            #left
            v-if="$slots['toolbar-left']"
          >
            <slot name="toolbar-left" />
          </template>
          <slot name="toolbar" />
          <template
            #right
            v-if="$slots['toolbar-right']"
          >
            <slot name="toolbar-right" />
          </template>
        </u-dashboard-toolbar>
      </template>
      <template #body>
        <u-page-header
          headline="Tournaments"
          :title="tournament?.name ?? formatName.capitaliseName.value"
          :description="currentPage?.label"
        />
        <slot />
      </template>
    </u-dashboard-panel>
  </div>
</template>
