<script setup lang="ts">
const id = useRouteQuery<string>("year", new Date().getFullYear().toString())
useHead({ title: () => id.value, templateParams: { subPage: "Years" } })
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
