<script setup>
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <div class="flex justify-center items-center gap-2 font-semibold">
    <u-icon :name="icons.loading" />
    <span>Loading...</span>
  </div>
</template>
