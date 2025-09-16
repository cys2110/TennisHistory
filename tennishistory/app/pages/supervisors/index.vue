<script setup lang="ts">
useHead({ title: "Supervisors" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Supervisors",
  description: "A collection of tennis supervisors"
}))
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const selectedLetter = ref<string | undefined>()

// API call
const { data: supervisors, status } = await useFetch<PlayerInterface[]>("/api/supervisors", {
  key: "supervisors",
  default: () => [],
  server: false
})

const filteredSupervisors = computed(() => {
  if (supervisors.value && selectedLetter.value) {
    return supervisors.value.filter(supervisor => supervisor.last_name.startsWith(selectedLetter.value!))
  }
  return supervisors.value
})

// TOC
const toc = computed(() => [
  {
    id: "supervisors",
    items: filteredSupervisors.value.map(supervisor => ({
      label: supervisor.id,
      to: `#${supervisor.id}`
    }))
  }
])
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <filter-letters v-model="selectedLetter" />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div class="font-semibold">{{ filteredSupervisors.length }} supervisors</div>
          <u-command-palette
            v-if="filteredSupervisors.length"
            placeholder="Search supervisors"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Supervisors">
        <template
          #links
          v-if="mdAndDown"
        >
          <u-slideover
            title="Filters"
            class="ml-auto"
          >
            <u-button :icon="icons.filter" />

            <template #body>
              <filter-letters v-model="selectedLetter" />
            </template>
          </u-slideover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-grid v-if="supervisors.length || ['pending', 'idle'].includes(status)">
          <div
            v-if="supervisors.length"
            v-for="supervisor in filteredSupervisors"
            :key="supervisor.id"
            :id="supervisor.id"
          >
            <u-page-card
              :title="supervisor.id"
              highlight
              :to="{ name: 'supervisor', params: { id: kebabCase(supervisor.id) } }"
              :ui="{ title: 'text-center', body: 'w-full' }"
            />
          </div>

          <loading-base
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>
        <error-message
          v-else
          message="No supervisors found"
          :icon="icons.noSupervisor"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
