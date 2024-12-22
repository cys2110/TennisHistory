<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalBreakpoints } from '@/composables/useGlobalBreakpoints';
import type { EntryConnection } from '@/utils/types'

const { isBreakpointOrUp } = useGlobalBreakpoints()
const visible = ref(false)

const props = defineProps<{
    entryInfo: { array: EntryConnection['edges'][]; title: string }[]
}>()

const expandedRows = ref({})

const tableOptions = {
    rowBackground: '{violet.950}',
}
const subTableOptions = {
    rowBackground: '{zinc.800}'
}
const buttonOptions = {
    outlinedPrimaryColor: '{cyan.600}',
    outlinedPrimaryBorderColor: '{cyan.600}'
}
</script>

<template>
    <Fieldset id="entry-info" legend="Entry Information">
        <div v-if="isBreakpointOrUp('md')" class="w-full flex justify-end">
            <Button icon="pi pi-chart-scatter" @click="visible = true" size="small" variant="outlined"
                :dt="buttonOptions" />
            <Dialog v-model:visible="visible" modal header="Entry Information" class="w-3/4">
                <EntryInfoChart :entryInfo />
            </Dialog>
        </div>
        <DataTable v-model:expandedRows="expandedRows" :value="entryInfo" dataKey="title" size="small"
            :dt="tableOptions">
            <Column field="title" />
            <Column expander style="width: 5rem" />

            <template #expansion="{ data }">
                <DataTable :value="data.array" size="small" stripedRows :dt="subTableOptions">
                    <Column field="node.player.full_name" header="Player" />
                    <Column v-if="data.array[0].properties?.rank" field="properties.rank" header="Rank" />
                    <Column v-if="data.array[0].properties?.reason" field="properties.reason" header="Reason" />
                </DataTable>
            </template>
        </DataTable>
    </Fieldset>
</template>