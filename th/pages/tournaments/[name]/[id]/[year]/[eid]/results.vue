<script setup lang="ts">
definePageMeta({ name: "results" })
const {
  name,
  params: { name: paramName, year }
} = useRoute()
const currentPage = computed(() => EVENT_PAGES.find(page => page.name === name))
const tournamentName = computed(() => decodeName(paramName as string))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: `${tournamentName.value} ${year}` } })
const { icons } = useAppConfig()
</script>

<template>
  <event-wrapper>
    <u-alert
      variant="subtle"
      :icon="icons.alert"
      title="Coming soon!"
      color="success"
    />
  </event-wrapper>
</template>
