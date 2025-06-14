<script setup lang="ts">
definePageMeta({ name: "h2h-players" })
const { params } = useRoute()
const p1Name = computed(() => decodeName(params.p1Name as string))
const p2Name = computed(() => decodeName(params.p2Name as string))
useHead({ title: () => `${p1Name.value} vs ${p2Name.value}`, templateParams: { subPage: "H2H" } })
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
