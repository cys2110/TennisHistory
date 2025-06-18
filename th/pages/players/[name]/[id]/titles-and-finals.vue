<script setup lang="ts">
definePageMeta({ name: "titles-and-finals" })
const { icons } = useAppConfig()

const { name, params } = useRoute()
const playerName = computed(() => decodeName(params.name as string))
const currentPage = computed(() => PLAYER_PAGES.find(page => page.name === name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: playerName.value } })
</script>

<template>
  <player-wrapper>
    <!--TODO: Awaiting timeline component-->
    <u-alert
      variant="subtle"
      :icon="icons.alert"
      title="Coming soon!"
      color="success"
    />
  </player-wrapper>
</template>
