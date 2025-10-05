<script setup lang="ts">
useHead({ title: "Supervisors - TH Admin" })
const { data: supervisors, status } = await useFetch("/api/get-supervisors", { default: () => [] })

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
          <template #right>
            <create-supervisor />
            <u-popover>
              <u-button
                icon="lucide:table-of-contents"
                size="sm"
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
        <div v-if="['idle', 'loading'].includes(status)">Loading...</div>

        <div v-else-if="status === 'error'">
          Error loading supervisors.
          <u-button
            @click="() => reloadNuxtApp()"
            label="Refresh"
            icon="lucide:refresh-ccw"
          />
        </div>

        <u-page-list class="*:my-2">
          <edit-supervisor
            v-for="supervisor in supervisors"
            :key="supervisor.id"
            :supervisor
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
