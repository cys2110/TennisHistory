<script setup lang="ts">
definePageMeta({ name: "withdrawals" })

const {
  params: { id }
} = useRoute("withdrawals")
useHead({ title: () => `${id} Withdrawals - TH Admin` })
const {
  ui: { icons }
} = useAppConfig()

const {
  data: entries,
  status,
  refresh
} = await useFetch("/api/withdrawals/get", {
  query: { id },
  default: () => []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Withdrawals - ${id}`">
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <withdrawals-add :refresh />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <withdrawals-edit
            v-if="entries.length"
            v-for="(entry, index) in entries"
            :key="`withdrawal-${index}`"
            :entry
          />
          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="entries"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
