<script setup lang="ts">
import { headshot } from '@/utils/functions';
import { ref } from 'vue';

const props = defineProps<{
  stats: { category: string, p1Value: number, p2Value: number, p1Max?: number, p2Max?: number, p1Actual?: number, p2Actual?: number }[]
  p1: { full_name: string, id: string }
  p2: { full_name: string, id: string }
  tabValue: string
}>()

const checked = ref(false)
</script>

<template>
  <TabPanel :value="tabValue">
    <div class="w-full flex justify-end">
      <ToggleButton v-model="checked" offIcon="pi pi-chart-bar" onIcon="pi pi-bars" offLabel="" onLabel="" unstyled
        class="mb-5" pt:icon="text-cyan-600 text-3xl" pt:root="border-cyan-600 border-[1px] rounded px-2" />
    </div>
    <DataTable :value="stats" size="small" stripedRows v-if="!checked">
      <Column>
        <template #header>
          <div class="flex flex-col justify-center items-center">
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(p1.id)" />
            <div class="font-bold">{{ p1.full_name }}</div>
          </div>
        </template>
        <template #body="{ data }">
          <div class="flex flex-col items-center">
            <div v-if="data.p1Actual && data.p1Max" :class="{ '!font-bold': data.p1Value > data.p2Value }">{{
              data.p1Actual }}/{{ data.p1Max }}</div>
            <div :class="{ '!font-bold': data.p1Value > data.p2Value }">{{ data.p1Value }}<span
                v-if="data.p1Actual">%</span></div>
          </div>
        </template>
      </Column>
      <Column field="category" header="Category" class="!text-center" />
      <Column>
        <template #header>
          <div class="flex justify-center items-center flex-col">
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(p2.id)" />
            <div class="font-bold">{{ p2.full_name }}</div>
          </div>
        </template>
        <template #body="{ data }">
          <div class="flex flex-col items-center">
            <div v-if="data.p2Actual && data.p2Max" :class="{ '!font-bold': data.p2Value > data.p1Value }">{{
              data.p2Actual }}/{{ data.p2Max }}</div>
            <div :class="{ '!font-bold': data.p2Value > data.p1Value }">{{ data.p2Value }}<span
                v-if="data.p2Actual">%</span></div>
          </div>
        </template>
      </Column>
    </DataTable>
    <StatsBarChart v-if="checked" :stats="stats" :p1="p1.full_name" :p2="p2.full_name" />
  </TabPanel>
</template>

<style scoped>
:deep(.p-datatable-column-header-content) {
  display: flex;
  justify-content: center;
}

:deep(.p-datatable-thead tr th) {
  background-color: var(--p-violet-800);
}
</style>