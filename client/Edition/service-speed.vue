<script setup lang="ts">
const props = defineProps<{
    stats: {
        name: string;
        p1: {
            low: number;
            high: number;
        };
        p2: {
            low: number;
            high: number;
        };
    }[];
    p1_name: string;
    p2_name: string;
    p1_id: string;
    p2_id: string;
}>();
const checked = ref(false);
</script>

<template>
    <shadcn-tabs-content :value="4">
        <div class="w-full flex justify-end">
            <shadcn-switch
                :checked
                @update:checked="checked = $event"
            >
                <template #thumb>
                    <Icon
                        :name="checked ? 'ph:table-duotone' : 'ph:gauge-duotone'"
                        class="text-emerald-600"
                    />
                </template>
            </shadcn-switch>
        </div>
        <service-speed-table
            v-if="!checked"
            :stats
            :p1_name
            :p2_name
            :p1_id
            :p2_id
        />
        <div
            v-else
            class="flex gap-2"
        >
            <service-speed-gauge
                v-for="stat in stats"
                :key="stat.name"
                :stat
                :p1_name
                :p2_name
                :p1_id
                :p2_id
            />
        </div>
    </shadcn-tabs-content>
</template>
