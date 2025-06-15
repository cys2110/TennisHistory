<script setup lang="ts">
definePageMeta({ name: "country" })
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
useHead({ title: () => name.value, templateParams: { subPage: "Countries" } })

const relatedPages = [
  {
    label: "Events",
    to: { name: "country-events" },
    icon: icons.event
  },
  {
    label: "Players",
    to: { name: "country-players" },
    icon: icons.player
  }
]
</script>

<template>
  <page-wrapper>
    <template #nav-right>
      <u-button
        v-for="page in relatedPages"
        :key="page.label"
        :to="page.to"
        :size="mdAndDown ? 'xs' : 'sm'"
        :icon="page.icon"
        :label="mdAndDown ? undefined : page.label"
      />
    </template>

    <u-page-list class="flex flex-col gap-5">
      <country-number-ones />
      <country-big-titles />
      <country-venues />
    </u-page-list>
  </page-wrapper>
</template>
