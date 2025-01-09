<script setup lang="ts">
const props = defineProps<{ event: EventCardType }>()
const { tname, ename, start, tid, year, eid, category, city, dates, surface, country } = props.event

// Disabled buttons if event has not started yet
const startDate = new Date(start)
const currentDate = new Date()
const isDisabled = currentDate < startDate
</script>

<template>
  <card :id="`event-${eid}`">
    <card-header>
      <card-title class="flex items-center gap-3">
        <div>
          <avatar class="border border-slate-400/50">
            <avatar-image :src="`/category/${category}.svg`" :alt="category" class="bg-slate-100/50 dark:bg-slate-400/50" />
            <avatar-fallback>
              <i-game-icons-tennis-court />
            </avatar-fallback>
          </avatar>
        </div>
        <div>
          <router-link :to="{ name: 'tournament', params: { name: encodeName(tname), id: tid } }">{{ tname }}</router-link>
        </div>
      </card-title>
      <card-description v-if="ename">{{ ename }}</card-description>
    </card-header>
    <card-content class="flex flex-col justify-end">
      <separator class="mt-2 mb-4" />
      <div class="text-slate-700 dark:text-slate-300 text-sm">
        <div v-if="city" class="text-center md:text-left flex items-center gap-2">
          <span>{{ city }}</span>
          <span>
            <flag-icon :country />
          </span>
        </div>
        <div class="text-center md:text-left">{{ dates }}</div>
        <div v-if="surface" class="text-center md:text-left">
          {{ surface }}
        </div>
      </div>
    </card-content>
    <card-footer class="flex justify-evenly items-center">
      <el-tooltip v-for="page in EVENT_PAGES" :key="page.name" :disabled="!isDisabled" content="Event has not started yet" effect="customised">
        <el-button round class="!bg-transparent !text-slate-400 hover:!text-slate-300 !border-emerald-600 shadow-sm shadow-emerald-500 hover:shadow-md hover:shadow-emerald-500" :disabled="isDisabled" size="small" tag="router-link" :to="{ name: page.name, params: { name: encodeName(tname), id: tid, year, eid } }">
          <template #icon>
            <font-awesome-icon :icon="page.icon" />
          </template>
          {{ page.title }}
        </el-button>
      </el-tooltip>
    </card-footer>
  </card>
</template>

<style>
.el-popper.is-customised {
  @apply text-slate-400 bg-slate-950;
}
</style>
