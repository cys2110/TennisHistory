<script setup lang="ts">
useHead({ title: "Umpires" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Umpires",
  description: "A collection of tennis umpires"
}))

const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

// API call
const { data: umpires, status } = await useFetch<PlayerInterface[]>("/api/umpires", {
  key: "umpires",
  default: () => [],
  server: false
})

const selectedLetter = ref<string | undefined>()

const filteredUmpires = computed(() => {
  if (umpires.value && selectedLetter.value) {
    return umpires.value.filter(supervisor => supervisor.last_name.startsWith(selectedLetter.value!))
  }
  return umpires.value
})

// TOC
const toc = computed(() => [
  {
    id: "umpires",
    items: filteredUmpires.value.map(umpire => ({
      label: umpire.id,
      to: `#${umpire.id}`
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
          <div class="font-semibold">{{ filteredUmpires.length }} umpires</div>
          <u-command-palette
            v-if="filteredUmpires.length"
            placeholder="Search umpires"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Umpires">
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
        <u-page-grid v-if="filteredUmpires.length || ['pending', 'idle'].includes(status)">
          <div
            v-if="filteredUmpires.length"
            v-for="umpire in filteredUmpires"
            :key="umpire.id"
            :id="umpire.id"
          >
            <u-page-card
              :title="umpire.id"
              highlight
              :to="{ name: 'umpire', params: { id: kebabCase(umpire.id) } }"
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
          message="No umpires found"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
