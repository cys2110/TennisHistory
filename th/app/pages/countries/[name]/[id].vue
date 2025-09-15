<script setup lang="ts">
definePageMeta({ name: "country" })
const {
  params: { id, name }
} = useRoute("country")
const { icons } = useAppConfig()

// API call
const { data: country } = await useFetch<CountryInterface>("/api/countries/overview", {
  query: { id },
  server: false
})

useHead({ title: () => `${country.value?.name || capitalCase(name as string)} | Countries` })
const countryName = useState<string>("country-name", () => capitalCase(name as string))

watch(country, () => {
  if (country.value) countryName.value = country.value.name
})

const toc = [
  { label: "Number Ones", to: "#number-ones", icon: icons.one },
  { label: "Big Titles", to: "#big-titles", icon: icons.tournament },
  { label: "Venues", to: "#venues", icon: icons.venue },
  { label: "Events", to: "#events", icon: icons.event },
  { label: "Players", to: "#players", icon: icons.player }
]
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template #right>
            <u-dropdown-menu :items="toc">
              <u-button
                :icon="icons.toc"
                variant="ghost"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-list class="*:my-5">
          <country-number-ones />
          <country-big-titles />
          <country-venues />
          <country-events />
          <country-players />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
