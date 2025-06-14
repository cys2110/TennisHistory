<script setup lang="ts">
useHead({ title: "Supervisors", templateParams: { subPage: null } })
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
