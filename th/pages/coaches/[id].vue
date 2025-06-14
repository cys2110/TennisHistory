<script setup lang="ts">
definePageMeta({ name: "coach" })
const { params } = useRoute()
const name = computed(() => decodeName(params.id as string))
useHead({ title: () => name.value, templateParams: { subPage: "Coaches" } })
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
