<script setup lang="ts">
definePageMeta({ name: "umpire" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Umpires" } })

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire },
  { label: name.value }
])

const year = ref<string>(new Date().getFullYear().toString())

// API calls
// Don't run the fetch immediately - wait until the year is selected
const {
  data: umpire,
  status,
  execute,
  refresh: refreshUmpire
} = await useFetch<{ labels: string[]; results: UmpireDetailsType[] }>(
  "/api/umpires/umpire-details",
  {
    query: { id: name.value, year },
    immediate: false,
    watch: false,
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching ${name.value}'s details`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

// When data returns, set the year to the latest year and run the first fetch
const { data: years, refresh } = await useFetch<string[]>("/api/umpires/umpire-years", {
  query: { id: name.value },
  watch: false,
  onResponse: ({ response }) => {
    year.value = response._data[response._data.length - 1]
    execute()
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s active years`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

watch(
  () => [name.value, year.value],
  ([newName, newYear]) => {
    if ((newYear || newName) && route.name === "umpire") refreshUmpire()
  },
  { immediate: true }
)

watch(
  () => name.value,
  newName => {
    if (newName && route.name === "umpire") refresh()
  },
  { immediate: true }
)

// Anchor links
const links = computed(() => {
  if (umpire.value)
    return umpire.value.results.map(event => ({
      to: "#event-" + event.id,
      label: event.tournament.name
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #right>
        <u-button
          v-if="umpire?.labels.includes('Supervisor')"
          :icon="ICONS.supervisor"
          label="Supervisor Profile"
          :to="{ name: 'supervisor', params: { id } }"
          size="xs"
        />
      </template>

      <template #toolbar>
        <year-select
          v-if="years"
          v-model="year"
          :items="years"
        />

        <div class="text-(--ui-text-muted) text-sm font-semibold">
          Matches umpired by {{ name }}
        </div>

        <!--TOC-->
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <u-page-columns
        v-if="umpire?.results.length || ['pending', 'idle'].includes(status)"
        class="lg:columns-2 xl:columns-2 2xl:columns-4"
      >
        <umpire-event-card
          v-if="umpire"
          v-for="event in umpire.results"
          :key="event.id"
          :id="`event-${event.id}`"
          :event
        />
        <umpire-event-loading-card
          v-else
          v-for="_ in 10"
          :key="_"
        />
      </u-page-columns>

      <error-message
        v-else
        :title="`No matches umpired by ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
