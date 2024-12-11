<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints';
import { formatCurrency } from '@/utils/functions';
import { Currency, type Round } from '@/utils/types'

const { isBreakpointOrUp } = useGlobalBreakpoints()

const props = defineProps<{ rounds: Omit<Round, 'matches' | 'event'>[]; currency: Currency }>()
const visible = ref(false)

const buttonOptions = {
    outlinedPrimaryColor: '{cyan.600}',
    outlinedPrimaryBorderColor: '{cyan.600}'
}
</script>

<template>
    <Fieldset id="awards" legend="Awards" class="my-10">
        <div v-if="isBreakpointOrUp('md')" class="w-full flex justify-end">
            <Button icon="pi pi-chart-scatter" @click="visible = true" size="small" variant="outlined"
                :dt="buttonOptions" />
            <Dialog v-model:visible="visible" modal header="Awards" class="w-3/4">
                <PrizeMoneyChart :rounds :currency />
            </Dialog>
        </div>
        <DataTable :value="rounds" size="small" stripedRows>
            <Column field="round" header="Round" class="!text-center text-xs md:text-sm xl:text-base" />
            <Column field="points" header="Points" class="!text-center text-xs md:text-sm xl:text-base" />
            <Column field="pm" header="Prize Money" class="!text-center text-xs md:text-sm xl:text-base">
                <template #body="{ data }">
                    {{ currency ? formatCurrency(currency, data.pm) : '—' }}
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