<script setup lang="ts">
definePageMeta({ name: "h2h-players" })
const route = useRoute()
const appConfig = useAppConfig()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const lgAndUp = breakpoints.greaterOrEqual("lg")

const p1Name = computed(() => decodeName(route.params.p1Name as string))
const p2Name = computed(() => decodeName(route.params.p2Name as string))
const p1Id = computed(() => route.params.p1Id as string)
const p2Id = computed(() => route.params.p2Id as string)

const tour = computed(() => (p1Id.value.length === 4 ? "atp" : "wta") as "atp" | "wta")

// Related links
const links = computed(() => [
  {
    label: p1Name.value,
    to: { name: "player", params: { name: route.params.p1Name, id: p1Id.value } },
    color: tour.value
  },
  {
    label: p2Name.value,
    to: { name: "player", params: { name: route.params.p2Name, id: p2Id.value } },
    color: tour.value
  }
])

// API call
const { data: h2h } = await useFetch<{ p1: CountryInterface; p2: CountryInterface }>("/api/h2h/countries", {
  query: { p1Id: route.params.p1Id, p2Id: route.params.p2Id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching countries for ${p1Name.value} v. ${p2Name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-button
        v-if="lgAndUp"
        v-for="link in links"
        :key="link.label"
        :to="link.to"
        :label="link.label"
        :color="link.color"
        size="sm"
      />
      <u-dropdown-menu
        v-else
        :items="links"
      >
        <u-button
          :icon="ICONS.layers"
          color="neutral"
          variant="link"
          size="xl"
        />
      </u-dropdown-menu>
    </template>

    <template #toolbar>
      <player-search
        v-if="h2h"
        :index="1"
        :country="h2h?.p1"
        :id="p1Id"
        :name="p1Name"
      />
      <player-search
        v-if="h2h"
        :index="2"
        :country="h2h?.p2"
        :id="p2Id"
        :name="p2Name"
      />
    </template>

    <div v-if="h2h">
      <h2h-details
        v-if="h2h"
        :c1="h2h.p1"
        :c2="h2h.p2"
      />

      <h2h-matches
        v-if="h2h"
        :tour
      />
    </div>

    <error-message
      v-else
      :icon="ICONS.noH2H"
      :message="`No head to head found between ${p1Name} and ${p2Name}`"
    />
  </page-wrapper>
</template>
