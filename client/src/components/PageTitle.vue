<script setup lang="ts">
const router = useRouter()
const navigateHome = () => router.push({ name: 'home' })
</script>

<template>
  <el-page-header class="my-10" @back="navigateHome">
    <template #breadcrumb v-if="$slots.breadcrumb">
      <slot name="breadcrumb" />
    </template>
    <template #icon>
      <font-awesome-icon :icon="['fad', 'house']" class="!text-lg" />
    </template>
    <template #title><div></div></template>
    <template #content>
      <div class="text-3xl text-slate-700 dark:text-slate-400">
        <slot name="heading" />
      </div>
      <slot name="subtitle" />
    </template>
  </el-page-header>
</template>
