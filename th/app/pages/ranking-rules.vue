<script setup lang="ts">
import type { Collections } from "@nuxt/content"

const appConfig = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const year = useRouteQuery("year", new Date().getFullYear().toString())
useHead({ title: () => `${year.value} | Ranking Rules` })

const selectedTour = ref("atp")

// Fetch ranking rules for selected year
const { data: rules } = await useAsyncData(
  `${selectedTour.value}-rules-${year.value}`,
  () => {
    return queryCollection(`${selectedTour.value}_rules` as keyof Collections)
      .where("years", "LIKE", `%${year.value}%`)
      .first()
  },
  { watch: [year] }
)

// Fetch points for selected year
const { data: points } = await useAsyncData(
  `${selectedTour.value}-points-${year.value}`,
  () => {
    return queryCollection(`${selectedTour.value}_points` as keyof Collections)
      .where("years", "LIKE", `%${year.value}%`)
      .first()
  },
  { watch: [year] }
)
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <!--Link to Open Era Rankings (source)-->
      <u-button
        to="https://openerarankings.com"
        :trailing-icon="appConfig.ui.icons.external"
        :size="mdAndUp ? 'sm' : 'xs'"
      >
        Open Era Rankings
      </u-button>
    </template>

    <template #toolbar>
      <select-all-years v-model="year" />
    </template>

    <u-page-header>
      <template #title>
        {{ !rules ? "No" : undefined }} Ranking Rules for {{ year }}
        {{ !rules ? "Available" : undefined }}
      </template>
    </u-page-header>

    <!--Render rules-->
    <ContentRenderer
      v-if="rules"
      :value="rules"
    />

    <!--Render points-->
    <ContentRenderer
      class="-mt-15"
      v-if="points"
      :value="points"
    />
  </page-wrapper>
</template>
