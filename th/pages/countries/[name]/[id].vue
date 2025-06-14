<script setup lang="ts">
definePageMeta({ name: "country" })
const { params } = useRoute()
const name = computed(() => decodeName(params.name as string))
useHead({ title: () => name.value, templateParams: { subPage: "Countries" } })
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
