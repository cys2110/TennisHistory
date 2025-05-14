<script setup lang="ts">
const { pm, status } = defineProps<{ pm: HistoricalPMInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid
    v-if="pm.length || ['pending', 'idle'].includes(status)"
    class="lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  >
    <u-page-card
      v-if="pm.length"
      v-for="round in pm"
      :key="round.year"
      :ui="{ description: 'text-sm', body: 'w-full', title: 'flex items-center gap-5 justify-between' }"
    >
      <template #title>
        <u-link
          class="hover-link w-fit"
          :to="{ name: 'event', params: { id: route.params.id as string, name: route.params.name as string, eid: round.id, year: round.year } }"
        >
          {{ round.year }}
        </u-link>
      </template>

      <template #description>
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span>Prize Money</span>
            <span class="font-semibold"
              >{{ round.pm.toLocaleString("en-US", { style: "currency", currency: round.currency }) }} ({{ round.yoy }})</span
            >
          </div>
          <div class="flex items-center justify-between">
            <span>Win</span>
            <span class="font-semibold">{{ round.W.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Final</span>
            <span class="font-semibold">{{ round.F.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Semifinals</span>
            <span class="font-semibold">{{ round.SF.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Quarterfinals</span>
            <span class="font-semibold">{{ round.QF.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Round of 16</span>
            <span class="font-semibold">{{ round.R16.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div
            v-if="round.R32"
            class="flex items-center justify-between"
          >
            <span>Round of 32</span>
            <span class="font-semibold">{{ round.R32.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div
            v-if="round.R64"
            class="flex items-center justify-between"
          >
            <span>Round of 64</span>
            <span class="font-semibold">{{ round.R64.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
          <div
            v-if="round.R128"
            class="flex items-center justify-between"
          >
            <span>Round of 128</span>
            <span class="font-semibold">{{ round.R128.toLocaleString("en-US", { style: "currency", currency: round.currency }) }}</span>
          </div>
        </div>
      </template>
    </u-page-card>
    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noAwards"
    :message="`No prize money found for ${name}`"
  />
</template>
