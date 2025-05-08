<script setup lang="ts">
defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const toast = useToast()

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

interface UmpiresAPIResponse {
  count: number
  umpires: string[]
}

// API call
const { data, status } = await useFetch<UmpiresAPIResponse>("/api/umpires", {
  query: {
    letter: selectedLetter,
    skip: computed(() => (page.value - 1) * pageSize.value),
    limit: pageSize
  },
  default: () => ({ count: 0, umpires: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching umpires",
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
          title="No umpires found"
        />
        <u-page-grid v-else>
          <base-card
            v-if="data.count"
            v-for="umpire in data.umpires"
            :key="umpire"
            type="umpire"
            :id="umpire"
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
