<script setup lang="ts">
useHead({ title: "Coaches" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Coaches",
  description: "A collection of tennis coaches"
}))
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const letter = ref<string>("A")

// API call
const { data, status } = await useFetch<{ total: number; coach: PlayerInterface }[]>("/api/coaches", {
  key: `coaches-${letter.value}`,
  query: { letter },
  default: () => [],
  server: false
})

const coaches = computed(() => data.value.map(item => item.coach))

// TOC
const toc = computed(() => [
  {
    id: "coaches",
    items: coaches.value.map(coach => ({
      label: `${coach.first_name} ${coach.last_name}`,
      to: `#${coach.id}`
    }))
  }
])
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <filter-letters
            v-model="letter"
            letters-only
          />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div class="font-semibold">{{ coaches.length }} coaches</div>
          <u-command-palette
            v-if="coaches.length"
            placeholder="Search coaches"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Coaches">
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
              <filter-letters
                v-model="letter"
                letters-only
              />
            </template>
          </u-slideover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-grid v-if="coaches.length || ['pending', 'idle'].includes(status)">
          <div
            v-if="coaches.length"
            v-for="coach in coaches"
            :key="coach.id"
            :id="coach.id"
          >
            <u-page-card
              :title="`${coach.first_name} ${coach.last_name}`"
              :to="{ name: 'coach', params: { id: kebabCase(coach.id) } }"
              highlight
              :ui="{ body: 'w-full', title: 'text-center' }"
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
          message="No coaches found"
          :icon="icons.noPeople"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
