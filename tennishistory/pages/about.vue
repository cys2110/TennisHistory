<script setup lang="ts">
definePageMeta({
  name: "about",
  layout: "visitor-layout"
})
useHead({
  title: "About",
  templateParams: { subPage: null }
})
</script>

<template>
  <u-page class="lg:w-4/5 mx-auto">
    <u-page-header title="About">
      <template #description> DISCLAIMER: This website is not intended to infringe on any copyright. It is not intended for any monetary or any other disallowed purpose. </template>
    </u-page-header>

    <u-page-body> This website displays data about Open Era men's singles tennis in a user-friendly format. The goal is to include data going back to 1968 as well as Davis Cup data. At some point in the future, I may include women's tennis or men's doubles or tournaments lower than the ATP Tour, but for now no expansion is planned on the data. Instead new features will be introduced as often as possible. Suggestions are welcome! </u-page-body>
  </u-page>
</template>
