<script setup lang="ts">
import { ref } from 'vue';
import type { Entry } from '@/utils/types'
import { encodeName, headshot } from '@/utils/functions';

const props = defineProps<{
  entries: Pick<Entry, 'player' | 'rank' | 'seed' | 'status'>[]
}>()

const checked = ref(false)
</script>

<template>
  <Fieldset id="entries" legend="Entries">
    <div class="w-full flex justify-end my-2">
      <ToggleButton v-model="checked" offIcon="pi pi-th-large" onIcon="pi pi-bars" offLabel="" onLabel="" unstyled
        class="mb-5" pt:icon="text-cyan-600 text-3xl" pt:root="border-cyan-600 border-[1px] rounded px-2" />
    </div>
    <DataTable v-if="!checked" :value="entries" size="small" stripedRows>
      <Column field="player.country" header="Country" class="!text-center">
        <template #body="{ data }">
          <GetFlag :country="data.player.country.id" />
        </template>
      </Column>
      <Column field="player.id">
        <template #body="{ data }">
          <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(data.player.id)" />
        </template>
      </Column>
      <Column field="player.last_name" header="Player" sortable>
        <template #sorticon>
          <i class="pi pi-sort !text-zinc-400" />
        </template>
        <template #body="{ data }">
          <router-link class="hover-link"
            :to="{ name: 'player', params: { name: encodeName(data.player.full_name), id: data.player.id } }">{{
              data.player.full_name }}</router-link>
        </template>
      </Column>
      <Column field="seed" header="Seed" sortable class="!text-center">
        <template #sorticon>
          <i class="pi pi-sort !text-zinc-400" />
        </template>
      </Column>
      <Column field="status" header="Entry Info" sortable class="!text-center">
        <template #sorticon>
          <i class="pi pi-sort !text-zinc-400" />
        </template>
      </Column>
      <Column field="rank" header="Rank" sortable class="!text-center">
        <template #sorticon>
          <i class="pi pi-sort !text-zinc-400" />
        </template>
      </Column>
    </DataTable>
    <div v-if="checked" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      <EntryCard v-for="entry in entries" :entry="entry" :key="entry.player.id" />
    </div>
  </Fieldset>
</template>

<style scoped>
:deep(.p-datatable-column-header-content) {
  display: flex;
  justify-content: center;
}
</style>