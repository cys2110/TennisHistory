<script setup lang="ts">
useHead({ title: "About", templateParams: { subPage: null } })
</script>

<template>
  <page-wrapper>
    <template #toolbar>
      <div class="text-(--ui-text-muted) text-xl">
        DISCLAIMER: This website is not intended to infringe on any copyright. It is not intended for any monetary or any other disallowed purpose.
      </div>
    </template>

    <u-container>
      <div>
        This website displays data about Open Era men's and women's tennis in a user-friendly format. The goal is to include data going back to 1968,
        but given the volume of the data, please be patient. New features will be introduced as often as possible. Suggestions are welcome!
      </div>
      <div>
        You can toggle between light and dark mode as well as between list and card view by clicking the settings button at the top of the sidebar or
        by pressing the
        <u-kbd value="meta" /><u-kbd value="k" /> keys. Card view provides a more aesthetic view of the data but list view provides a quicker
        overview.
      </div>
    </u-container>
  </page-wrapper>
</template>
