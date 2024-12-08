<script setup lang="ts">
import { ref } from 'vue';
import type { Entry } from '@/utils/types'
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints';

const { isBreakpointOrUp } = useGlobalBreakpoints()
const visible = ref(false)

const props = defineProps<{
    seeds: Pick<Entry, 'seed' | 'rank' | 'player'>[]
}>()

const buttonOptions = {
    outlinedPrimaryColor: '{cyan.600}',
    outlinedPrimaryBorderColor: '{cyan.600}'
}
</script>

<template>
    <Fieldset id="seeds" legend="Seeded Players">
        <div v-if="isBreakpointOrUp('md')" class="w-full flex justify-end">
            <Button icon="pi pi-chart-scatter" @click="visible = true" size="small" variant="outlined"
                :dt="buttonOptions" />
            <Dialog v-model:visible="visible" modal header="Seeded Players" class="w-3/4">
                <SeedsChart :seeds />
            </Dialog>
        </div>
        <DataTable :value="seeds" size="small" stripedRows>
            <Column field="seed" header="Seed" sortable class="!text-center">
                <template #sorticon>
                    <i class="pi pi-sort !text-zinc-400" />
                </template>
            </Column>
            <Column field="player.last_name" header="Player" sortable class="!text-center">
                <template #sorticon>
                    <i class="pi pi-sort !text-zinc-400" />
                </template>
                <template #body="{ data }">
                    <PlayerRow :player="data.player" />
                </template>
            </Column>
            <Column field="rank" header="Rank" sortable class="!text-center">
                <template #sorticon>
                    <i class="pi pi-sort !text-zinc-400" />
                </template>
            </Column>
        </DataTable>
    </Fieldset>
</template>

<style scoped>
:deep(.p-datatable-column-header-content) {
    display: flex;
    justify-content: center;
}
</style>