<script setup lang="ts">
const props = defineProps<{ event: EventCardType }>()
const { surface, category, name, ename, dates, city, country, tid, eid, year, start } = props.event
</script>

<template>
  <u-card
    :id="`event-${eid}`"
    :ui="{ header: 'p-0 sm:px-0' }"
  >
    <template #header>
      <div class="relative">
        <nuxt-img
          :src="`/surfaces/${surface ?? 'Hard'}.jpg`"
          :alt="surface"
          loading="lazy"
          class="opacity-75 rounded-t-lg"
        />
        <category-avatar
          v-if="category"
          :category
          class="absolute top-4 left-4"
        />
      </div>
    </template>

    <div class="flex flex-col gap-1">
      <nuxt-link
        class="hover-link text-lg font-semibold"
        :to="{ name: 'tournament', params: { name: useChangeCase(name, 'kebabCase').value, tid } }"
      >
        {{ name }}
      </nuxt-link>
      <div
        v-if="ename"
        class="text-sm"
      >
        {{ ename }}
      </div>
      <div class="flex gap-2 items-center">
        <span class="text-slate-500 dark:text-slate-400 text-sm">{{ city }}</span>
        <flag-icon :country />
      </div>
      <div class="text-slate-500 dark:text-slate-400 text-sm">{{ dates }}</div>
    </div>

    <template #footer>
      <event-buttons
        :name
        :tid
        :year
        :eid
        :start
      />
    </template>
  </u-card>
</template>
