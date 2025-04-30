<script setup lang="ts">
useHead({ title: "About", templateParams: { subPage: null } })
const appConfig = useAppConfig()

const items = [
  { label: "Home", icon: ICONS.home, to: { name: "home" } },
  { label: "About", icon: appConfig.ui.icons.info }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="items" />
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-xl"
          >DISCLAIMER: This website is not intended to infringe on any copyright. It is not intended
          for any monetary or any other disallowed purpose.</div
        >
      </template>

      <div class="xl:w-1/2 mx-auto">
        This website displays data about Open Era men's singles tennis in a user-friendly format.
        The goal is to include data going back to 1968 as well as Davis Cup data. At some point in
        the future, I may include women's tennis or men's doubles or tournaments lower than the ATP
        Tour, but for now no expansion is planned on the data. Instead new features will be
        introduced as often as possible. Suggestions are welcome!
      </div>
    </nuxt-layout>
  </div>
</template>
