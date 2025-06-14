<script setup lang="ts">
definePageMeta({ name: "category" })
const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Categories" } })
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
