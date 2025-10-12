<script setup lang="ts">
definePageMeta({ name: "walkovers" })

const {
  params: { id }
} = useRoute("walkovers")
useHead({ title: () => `${id} Walkovers - TH Admin` })
const {
  ui: { icons }
} = useAppConfig()

const {
  data: entries,
  status,
  refresh
} = await useFetch("/api/retirements/get", {
  query: { id, type: "WALKOVER" },
  default: () => []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Walkovers - ${id}`">
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
          <retirements-add
            type="Walkover"
            :refresh
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <retirements-edit
            v-if="entries.length"
            v-for="(entry, index) in entries"
            :key="`walkover-${index}`"
            :entry
            type="Walkover"
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
