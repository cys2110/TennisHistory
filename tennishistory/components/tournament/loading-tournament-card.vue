<template>
  <u-page-grid>
    <u-card
      v-for="i in new Array(4)"
      :key="i"
    >
      <template #header>
        <u-skeleton class="h-6 bg-slate-700" />
      </template>

      <div class="flex flex-col gap-2">
        <u-skeleton class="h-4 w-3/4 bg-slate-700" />
        <div class="text-center text-xs">d.</div>
        <u-skeleton class="h-4 w-3/4 bg-slate-700" />
        <u-skeleton class="h-4 w-1/2 mx-auto bg-slate-700" />
      </div>

      <template #footer>
        <u-skeleton class="h-4 w-3/4 bg-slate-700" />
      </template>
    </u-card>
  </u-page-grid>
</template>
