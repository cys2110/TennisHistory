<script setup lang="ts">
definePageMeta({ name: "home" })
useHead({ title: "Home", templateParams: { subPage: null } })
</script>

<template>
  <div>
    <u-alert
      title="Tennis History"
      description="Currently upgrading to include doubles, WTA and lower level tournament data!"
    />
  </div>
</template>
