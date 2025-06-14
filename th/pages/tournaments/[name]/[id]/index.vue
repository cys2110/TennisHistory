<script setup lang="ts">
definePageMeta({ name: "tournament" })
const {
  params: { name: paramName }
} = useRoute()
const name = computed(() => decodeName(paramName as string))
useHead({ title: () => name.value, templateParams: { subPage: "Tournaments" } })
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
