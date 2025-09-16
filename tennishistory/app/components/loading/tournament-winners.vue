<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const smAndDown = breakpoints.smaller("md")
</script>

<template>
  <u-card class="ring-primary">
    <template #header>
      <u-skeleton class="h-5 w-3/4" />
    </template>

    <div class="grid grid-cols-2 gap-5">
      <u-skeleton
        v-for="_ in 2"
        :key="_"
        class="h-30 w-full"
      />
    </div>

    <template #footer>
      <u-skeleton class="h-6 w-40 mx-auto" />
    </template>
  </u-card>
</template>
