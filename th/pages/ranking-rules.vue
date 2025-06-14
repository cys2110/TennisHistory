<script setup lang="ts">
const year = useRouteQuery("year", new Date().getFullYear().toString())
useHead({ title: () => year.value, templateParams: { subPage: "Ranking Rules" } })
const { icons } = useAppConfig()
</script>

<template>
  <page-wrapper>
    <u-alert
      variant="subtle"
      :icon="icons.alert"
      title="Coming soon!"
      color="success"
    />
  </page-wrapper>
</template>
