<script setup lang="ts">
definePageMeta({ name: "about", layout: false })
useHead({ title: "About", templateParams: { subPage: null } })
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #leading-icon>
        <u-icon
          :name="ICONS.info"
          class="text-xl"
        />
      </template>
      <template #title>About</template>
      <div class="2xl:w-3/4 mx-auto flex flex-col gap-10">
        <div class="text-(--ui-text-muted) text-xl">DISCLAIMER: This website is not intended to infringe on any copyright. It is not intended for any monetary or any other disallowed purpose.</div>
        <div> This website displays data about Open Era men's singles tennis in a user-friendly format. The goal is to include data going back to 1968 as well as Davis Cup data. At some point in the future, I may include women's tennis or men's doubles or tournaments lower than the ATP Tour, but for now no expansion is planned on the data. Instead new features will be introduced as often as possible. Suggestions are welcome! </div>
      </div>
    </nuxt-layout>
  </div>
</template>
