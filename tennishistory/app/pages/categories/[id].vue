<script setup lang="ts">
import { EventCardRegular, EventCardSmall } from "#components"

definePageMeta({ name: "category" })

const {
  params: { id }
} = useRoute("category")
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const smAndDown = breakpoints.smallerOrEqual("sm")

const year = useRouteQuery("year", new Date().getFullYear(), { transform: Number })
const months = ref<MonthType[]>()
const environment = ref<EnvironmentType[]>()
const surfaces = ref<SurfaceType[]>()

// API call
const { data: category } = await useFetch<string>("/api/categories/overview", {
  key: `category-overview-${id}`,
  query: { id },
  server: false
})

const { data, status } = await useFetch<EventInterface[]>("/api/categories/details", {
  key: `category-details-${id}-${year}`,
  query: { id, year },
  default: () => [],
  server: false
})

useHead({
  title: () => `${get(category) ?? capitalCase(id as string)} | Categories`
})
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "ItemPage",
  name: get(category) ?? capitalCase(id as string),
  description: `Events with category ${get(category) ?? capitalCase(id as string)}`
}))

const events = computed(() =>
  get(data).filter(event => {
    const startDates = event.dates.map(d => d[0]).filter(Boolean)

    if (
      (get(surfaces)?.length && (!event.surface || !get(surfaces)!.includes(event.surface.surface))) ||
      (get(environment)?.length && (!event.surface || !get(environment)!.includes(event.surface.environment))) ||
      (get(months)?.length &&
        (startDates.length === 0 || startDates.some(date => date && date.year === get(year) && !get(months)?.includes(MONTHS[date.month - 1]!))))
    )
      return false
    return true
  })
)

const environmentOptions = computed<EnvironmentType[]>(
  () =>
    useSorted(
      useArrayUnique(
        get(data)
          .map(event => event.surface?.environment)
          .filter(Boolean)
      )
    ).value as EnvironmentType[]
)
const surfaceOptions = computed<SurfaceType[]>(
  () =>
    useSorted(
      useArrayUnique(
        get(data)
          .map(event => event.surface?.surface)
          .filter(Boolean)
      )
    ).value as SurfaceType[]
)

// TOC
const toc = computed(() => [
  {
    id: "events",
    items: get(events).map(event => ({
      label: event.tournament.name,
      to: `#event-${event.id}`
    }))
  }
])
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
          <u-command-palette
            v-if="data.length"
            placeholder="Search events"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200' }"
          />
        </u-page-aside>
      </template>

      <u-page-header
        headline="Categories"
        :title="category || capitalCase(id as string)"
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
