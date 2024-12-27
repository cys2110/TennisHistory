<script setup>
const props = defineProps(['stats', 'p1_name', 'p1_id', 'p2_name', 'p2_id', 'tabValue'])

const checked = ref(false)
</script>

<template>
    <tab-panel :value="tabValue">
        <div class="w-full flex justify-end">
            <toggle-button v-model="checked" size="small">
                <template #icon>
                    <Icon :name="checked ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'"
                        class="text-2xl" />
                </template>
            </toggle-button>
        </div>
        <match-stats-table v-if="!checked" :stats :p1_id :p1_name :p2_id :p2_name />
        <match-stats-chart v-else :stats :p1_name :p2_name />
    </tab-panel>
</template>