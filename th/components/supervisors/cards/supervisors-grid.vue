<script setup lang="ts">
defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

// API call
const { data, status } = useFetch<SupervisorsAPIResponseType>("/api/supervisors", {
  query: computed(() => ({
    letter: selectedLetter.value,
    skip: (page.value - 1) * pageSize.value,
    limit: pageSize.value
  })),
  default: () => ({ count: 0, supervisors: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching supervisors",
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
          <template #right>
            <set-page-size v-model="pageSize" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <letters-radio-group v-model="selectedLetter" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <error-message
          v-if="status === 'error' || !data.count"
          title="No supervisors found"
        />
        <u-page-grid v-else>
          <base-card
            v-if="data.count"
            v-for="supervisor in data.supervisors"
            :key="supervisor.id"
            type="supervisor"
            :supervisor
          />

          <base-loading-card
            v-else
            v-for="_ in 15"
            :key="_"
          />
        </u-page-grid>

        <pagination-component
          v-if="data.count"
          v-model="page"
          :total="data.count"
          :page-size="pageSize"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
