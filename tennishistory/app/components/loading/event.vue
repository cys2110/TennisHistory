<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const smAndDown = breakpoints.smaller("md")
</script>

<template>
  <u-card
    v-if="smAndDown"
    class="ring-primary"
  >
    <template #header>
      <u-skeleton class="h-3 w-full" />
    </template>
    <div class="flex gap-2 items-center">
      <div>
        <u-skeleton class="h-4 w-10" />
      </div>
      <div class="flex-1 flex flex-col gap-1">
        <u-skeleton
          v-for="i in 2"
          :key="`2-${i}`"
          class="h-2 w-full"
        />
      </div>
      <div class="flex flex-col gap-2">
        <u-skeleton
          v-for="i in 3"
          :key="`3-${i}`"
          class="h-2 w-10"
        />
      </div>
    </div>
  </u-card>
  <u-page-card
    v-else
    highlight
    reverse
    :ui="{
      wrapper: 'order-last flex flex-col items-start',
      footer: 'mx-auto',
      description: 'flex flex-col gap-2',
      body: 'w-full'
    }"
  >
    <u-skeleton class="h-50 lg:h-35 2xl:h-40" />

    <template #leading>
      <u-skeleton class="h-4 w-6" />
    </template>

    <template #title>
      <u-skeleton class="h-3 w-1/2 my-5" />
    </template>

    <template #description>
      <u-skeleton
        v-for="_ in 3"
        :key="_"
        class="h-2 w-full"
      />
    </template>

    <template #footer>
      <u-skeleton class="h-6 w-40" />
    </template>
  </u-page-card>
</template>
