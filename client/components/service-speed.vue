<script setup>
const props = defineProps(['stats', 'p1_name', 'p1_id', 'p2_name', 'p2_id'])

const checked = ref(false)
</script>

<template>
    <tab-panel value="4">
        <div class="w-full flex justify-end">
            <toggle-button v-model="checked" size="small">
                <template #icon>
                    <Icon :name="checked ? 'ph:table-duotone' : 'ph:gauge-duotone'" class="text-2xl" />
                </template>
            </toggle-button>
        </div>
        <service-speed-table v-if="!checked" :stats :p1_name :p2_name :p1_id :p2_id />
        <div v-else class="flex gap-2">
            <service-speed-gauge v-for="stat in stats" :key="stat.name" :stat :p1_name :p2_name :p1_id :p2_id />
        </div>
    </tab-panel>
</template>