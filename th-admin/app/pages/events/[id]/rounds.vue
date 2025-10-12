<script setup>
definePageMeta({ name: "rounds" })

const {
  params: { id }
} = useRoute("rounds")
useHead({ title: () => `${id} Rounds - TH Admin` })
const {
  ui: { icons }
} = useAppConfig()

const {
  data: rounds,
  status,
  refresh
} = await useFetch("/api/rounds/get", {
  query: { id },
  default: () => []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Rounds - ${id}`">
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
          <rounds-add :refresh />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <rounds-edit
          v-if="rounds.length"
          v-for="(round, index) in rounds"
          :key="`round-${index}`"
          :round="round"
        />
        <loading v-else-if="status === 'pending'" />
        <reload
          v-else
          message="rounds"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
