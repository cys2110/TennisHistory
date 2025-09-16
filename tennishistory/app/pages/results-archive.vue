<script setup lang="ts">
import { EventCardRegular, EventCardSmall } from "#components"

const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const smAndDown = breakpoints.smallerOrEqual("sm")
const {
  icons,
  ui: { colors }
} = useAppConfig()

const year = useRouteQuery("year", new Date().getFullYear(), { transform: Number })
const tours = ref<TourType[]>()
const months = ref<MonthType[]>()
const levels = ref<LevelType[]>()
const categories = ref<CategoryType[]>()
const environment = ref<EnvironmentType[]>()
const surfaces = ref<SurfaceType[]>()

useHead({ title: () => `Results Archive ${get(year)}` })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "ItemPage",
  name: "Results Archive",
  description: `Events which took place in ${get(year)}`
}))

// API call
const { data, status } = await useFetch<EventInterface[]>("/api/results-archive", {
  key: `results-archive-${year}`,
  query: { year },
  default: () => [],
  server: false
})

const events = computed(() =>
  data.value.filter(event => {
    const startMonths = event.dates
      .map(d => d[0])
      .filter(Boolean)
      .map(date => date!.month)

    if (
      (tours.value?.length && !event.tours.some(tour => tours.value?.includes(tour))) ||
      (categories.value?.length &&
        (event.categories.length === 0 || event.categories.some(category => category && !categories.value?.includes(category)))) ||
      (surfaces.value?.length && (!event.surface || !surfaces.value.includes(event.surface.surface))) ||
      (environment.value?.length && (!event.surface || !environment.value.includes(event.surface.environment))) ||
      (levels.value?.length && !event.levels.some(level => levels.value?.includes(level))) ||
      (months.value?.length && (startMonths.length === 0 || startMonths.some(month => month && !months.value?.includes(MONTHS[month - 1]!))))
    )
      return false
    return true
  })
)

const levelOptions = computed<LevelType[]>(() => useArrayUnique(data.value.flatMap(event => event.levels)).value.sort((a, b) => a.localeCompare(b)))
const environmentOptions = computed<EnvironmentType[]>(() =>
  useArrayUnique(data.value.map(event => event.surface?.environment).filter(Boolean)).value.sort((a, b) => a!.localeCompare(b!))
)
const surfaceOptions = computed<SurfaceType[]>(
  () => useArrayUnique(data.value.map(event => event.surface?.surface).filter(Boolean)).value.sort((a, b) => a!.localeCompare(b!)) as SurfaceType[]
)
const categoryOptions = computed<CategoryType[]>(
  () => useArrayUnique(data.value.flatMap(event => event.categories).filter(Boolean)).value.sort((a, b) => a!.localeCompare(b!)) as CategoryType[]
)

const toc = computed(() => [
  {
    id: "tournaments",
    label: "Tournaments",
    items: events.value.map(event => ({
      label: event.tournament.name,
      to: `#event-${event.id}`
    }))
  }
])

const eventCounts = computed<Record<string, { count: number; colour?: keyof typeof colors; brokenOut?: Record<string, number> }>>(() => {
  const atpEvents = events.value.filter(event => event.tours?.includes("ATP"))
  const wtaEvents = events.value.filter(event => event.tours?.includes("WTA"))

  return {
    Total: { count: events.value.length },
    ATP: {
      colour: "atp",
      count: atpEvents.length,
      brokenOut: {
        Tour: atpEvents.filter(event => event.categories[0] || (event.categories[1] && !ATP_CHALLENGER_CATEGORIES.includes(event.categories[1])))
          .length,
        Challenger: atpEvents.filter(event => event.categories[1] && ATP_CHALLENGER_CATEGORIES.includes(event.categories[1])).length
      }
    },
    WTA: {
      colour: "wta",
      count: wtaEvents.length,
      brokenOut: {
        Tour: wtaEvents.filter(event => event.categories[0] || (event.categories[2] && !WTA_CHALLENGER_CATEGORIES.includes(event.categories[2])))
          .length,
        Challenger: wtaEvents.filter(event => event.categories[2] && WTA_CHALLENGER_CATEGORIES.includes(event.categories[2])).length
      }
    },
    ITF: {
      colour: "itf",
      count: events.value.filter(event => event.tours?.includes("ITF (M)") || event.tours?.includes("ITF (W)")).length,
      brokenOut: {
        "ITF (M)": events.value.filter(event => event.tours?.includes("ITF (M)")).length,
        "ITF (W)": events.value.filter(event => event.tours?.includes("ITF (W)")).length
      }
    }
  }
})
</script>

<template>
  <u-container>
    <u-page>
      <template #left>
        <u-page-aside>
          <filter-select-all-years
            v-model="year"
            class="my-2"
          />
          <filter-select-months
            v-model="months"
            class="my-2"
          />
          <filter-checkbox-levels
            v-model="levels"
            :levels="levelOptions"
            class="my-2"
          />
          <filter-checkbox-tours
            v-model="tours"
            class="my-2"
          />
          <filter-select-categories
            v-model="categories"
            :categories="categoryOptions"
            class="my-2"
          />
          <filter-checkbox-surfaces
            v-model="surfaces"
            v-model:environment="environment"
            :environments="environmentOptions"
            :surfaces="surfaceOptions"
          />
        </u-page-aside>
      </template>

      <template #right>
        <u-page-aside>
          <div class="flex flex-col gap-1 my-5 text-sm">
            <div
              v-for="[label, counts] in Object.entries(eventCounts)"
              :key="label"
              :class="`text-${counts.colour}`"
            >
              <div class="font-semibold">{{ label }}: {{ counts.count }}</div>
              <div
                v-if="counts.brokenOut"
                v-for="[category, count] in Object.entries(counts.brokenOut)"
                :key="`${label}-${category}`"
                class="ml-2"
                :class="{ 'text-men': category === 'ITF (M)', 'text-women': category === 'ITF (W)' }"
              >
                {{ category }}: {{ count }}
              </div>
            </div>
          </div>
          <u-command-palette
            v-if="data.length"
            placeholder="Search events"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header
        headline="Results Archive"
        :title="year.toString()"
      >
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
              <filter-select-all-years
                v-model="year"
                class="my-2"
              />
              <filter-select-months
                v-model="months"
                class="my-2"
              />
              <filter-checkbox-levels
                v-model="levels"
                :levels="levelOptions"
                class="my-2"
              />
              <filter-checkbox-tours
                v-model="tours"
                class="my-2"
              />
              <filter-select-categories
                v-model="categories"
                :categories="categoryOptions"
                class="my-2"
              />
              <filter-checkbox-surfaces
                v-model="surfaces"
                v-model:environment="environment"
                :environments="environmentOptions"
                :surfaces="surfaceOptions"
              />
            </template>
          </u-slideover>
          <u-popover>
            <u-button :icon="icons.toc" />
            <template #content>
              <u-command-palette
                v-if="data.length"
                placeholder="Search events"
                :groups="toc"
                :loading="status === 'pending'"
                :fuse="{ resultLimit: 200 }"
                :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
              />
            </template>
          </u-popover>
        </template>
      </u-page-header>

      <u-page-body>
        <u-page-columns
          v-if="events.length || ['idle', 'pending'].includes(status)"
          class="scroll-smooth overflow-y-auto p-5"
        >
          <component
            v-if="events.length"
            :is="smAndDown ? EventCardSmall : EventCardRegular"
            v-for="event in events"
            :key="event.id"
            :event
          />

          <loading-event
            v-else
            v-for="_ in 6"
            :key="_"
          />
        </u-page-columns>
        <error-message
          v-else
          :message="`No events took place in ${year}`"
        />
      </u-page-body>
    </u-page>
  </u-container>
</template>
