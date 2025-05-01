<template>
  <u-page-card
    highlight
    reverse
    :ui="{ description: 'text-sm flex flex-col gap-1', wrapper: 'order-last' }"
  >
    <!--Need 'order-last' class for smaller screens-->
    <div class="relative">
      <u-skeleton class="h-40" />

      <u-skeleton
        class="h-10 rounded-full absolute top-3 left-3 border border-neutral-400 dark:border-neutral-700 w-10"
      />
    </div>

    <template #leading>
      <u-skeleton class="h-6 w-9 rounded-lg" />
    </template>

    <template #title>
      <u-skeleton class="h-7 w-60 rounded-lg" />
    </template>

    <template #description>
      <u-skeleton
        v-for="_ in 3"
        :key="_"
        class="h-4 w-40 rounded-lg"
      />
    </template>

    <template #footer>
      <u-skeleton
        class="h-8 w-60 rounded-lg ring-secondary-600 bg-secondary-600/10 dark:bg-secondary-400/10"
      />
    </template>
  </u-page-card>
</template>
