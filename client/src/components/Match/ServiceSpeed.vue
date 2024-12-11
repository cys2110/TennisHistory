<script setup lang="ts">
import { headshot } from '@/utils/functions';
import { ref } from 'vue';

const props = defineProps<{
  stats: { name: string, p1: number, p2: number }[]
  p1: { full_name: string, id: string }
  p2: { full_name: string, id: string }
}>()

console.log(props)

const checked = ref(false)
</script>

<template>
  <TabPanel value="4">
    <div class="w-full flex justify-end">
      <ToggleButton v-model="checked" offIcon="pi pi-gauge" onIcon="pi pi-bars" offLabel="" onLabel="" unstyled
        class="mb-5" pt:icon="text-cyan-600 text-3xl" pt:root="border-cyan-600 border-[1px] rounded px-2" />
    </div>
    <DataTable :value="stats" size="small" stripedRows v-if="!checked">
      <Column field="p1">
        <template #header>
          <div class="flex flex-col justify-center items-center">
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(p1.id)" />
            <div class="font-bold">{{ p1.full_name }}</div>
          </div>
        </template>
        <template #body="{ data }">
          <div class="flex flex-col items-center justify-center">
            <div :class="{ '!font-bold': data.p1 > data.p2 }">{{ data.p1 }} km/h</div>
            <div :class="{ '!font-bold': data.p1 > data.p2 }">{{ (data.p1 / 1.609344).toFixed(0) }} mph</div>
          </div>
        </template>
      </Column>
      <Column field="name" header="Category" class="!text-center" />
      <Column field="p2">
        <template #header>
          <div class="flex justify-center items-center flex-col">
            <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(p2.id)" />
            <div class="font-bold">{{ p2.full_name }}</div>
          </div>
        </template>
        <template #body="{ data }">
          <div class="flex flex-col items-center justify-center">
            <div :class="{ '!font-bold': data.p2 > data.p1 }">{{ data.p2 }} km/h</div>
            <div :class="{ '!font-bold': data.p2 > data.p1 }">{{ (data.p2 / 1.609344).toFixed(0) }} mph</div>
          </div>
        </template>
      </Column>
    </DataTable>
    <div class="flex" v-if="checked">
      <SpeedGauge v-for="stat in stats" :key="stat.name" :stat />
    </div>
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