<script setup>
useHead({ title: "Supervisors - TH Admin" })
const {
  ui: { icons }
} = useAppConfig()
const { data: supervisors, status } = await useFetch("/api/supervisors/get", { default: () => [] })

const toc = computed(() => [
  {
    id: "supervisors",
    label: "Supervisors",
    items: supervisors.value.map(supervisor => ({
      label: supervisor.id,
      to: `#${supervisor.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Supervisors">
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <create-person type="Supervisor" />
            <u-popover>
              <u-button
                :icon="icons.menu"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search supervisors"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <edit-person
            v-if="supervisors.length"
            v-for="supervisor in supervisors"
            :key="supervisor.id"
            :person="supervisor"
            type="Supervisor"
          />

          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="supervisors"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
