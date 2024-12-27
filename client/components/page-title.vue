<template>
  <div>
    <div class="flex flex-col md:flex-row mb-5 lg:mb-12 md:justify-between md:items-center">
      <div class="text-zinc-600 dark:text-zinc-300 text-3xl md:text-4xl xl:text-5xl">
        <slot name="heading" />
      </div>
      <div class="text-zinc-500 dark:text-zinc-400 md:ml-10 text-xl md:text-2xl xl:text-3xl text-right">
        <slot name="subtitle" />
      </div>
    </div>
  </div>
</template>