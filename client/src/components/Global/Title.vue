<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Grid } from 'ant-design-vue'

const route = useRoute()
const useBreakpoint = Grid.useBreakpoint
const screens = useBreakpoint()

const tournamentPages = ['tournament', 'event', 'draw', 'results', 'match']
const playerPages = ['player', 'activity', 'titles', 'index', 'stats']
</script>

<template>
  <a-page-header :ghost="true" class="!rounded-xl mb-10" :class="{ 'is-sm': screens.xs }">
    <template #breadcrumb>
      <TournamentBreadcrumbs v-if="!screens.xs && tournamentPages.includes(route.name as string)" />
      <PlayerBreadcrumbs v-if="!screens.xs && playerPages.includes(route.name as string)" />
    </template>
    <template #title>
      <div
        :class="{ 'text-4xl': screens.xl, 'text-3xl': screens.lg, 'text-base': screens.xs }"
        class="font-bold"
      >
        <slot name="title" />
      </div>
    </template>
    <template #subTitle>
      <div :class="{ 'text-2xl': screens.xl }">
        <slot name="subtitle" />
      </div>
    </template>
  </a-page-header>
</template>

<style scoped>
.is-sm :deep(.ant-page-header-heading-left) {
  flex-direction: column !important;
  align-items: start !important;
}
</style>
