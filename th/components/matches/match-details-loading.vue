<script setup lang="ts"></script>

<template>
  <u-container class="md:w-1/2 xl:w-1/3 2xl:w-1/4 border-2 border-primary-700 p-5 rounded-xl">
    <div class="text-xs sm:text-sm">
      <div class="flex justify-between my-1">
        <u-skeleton class="h-4 w-40 rounded-lg" />
        <u-skeleton class="h-4 w-40 rounded-lg" />
      </div>
      <div class="flex justify-between my-1">
        <u-skeleton class="h-4 w-40 rounded-lg" />
        <u-skeleton class="h-4 w-40 rounded-lg" />
      </div>
    </div>

    <div class="grid grid-flow-col grid-rows-2 items-center gap-3 mt-5 text-xs sm:text-sm">
      <u-skeleton class="h-6 w-full rounded-lg" />
      <u-skeleton class="h-6 w-full rounded-lg" />
    </div>
  </u-container>
</template>
