<script setup>
useHead({ title: "Coaches - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
const selectedLetter = ref("Update")

const {
  data: coaches,
  status,
  refresh
} = await useFetch("/api/coaches/get", {
  query: { letter: selectedLetter },
  default: () => []
})

watch(selectedLetter, () => {
  refresh()
})

const toc = computed(() => [
  {
    id: "coaches",
    label: "Coaches",
    items: coaches.value.map(coach => ({
      label: coach.first_name ? `${coach.first_name} ${coach.last_name}` : coach.id,
      to: `#${coach.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Coaches">
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <create-person type="Coach" />
            <u-popover>
              <u-button
                :icon="icons.menu"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search coaches"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-select-menu
            v-model="selectedLetter"
            :items="['Update', ...letters]"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <edit-person
            v-if="coaches.length"
            v-for="coach in coaches"
            :key="coach.id"
            :person="coach"
            type="Coach"
          />

          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="coaches"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
