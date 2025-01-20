<script setup lang="ts">
const props = defineProps<{
    stats: MatchStatsType[];
    p1_name: string;
    p2_name: string;
    p1_id: string;
    p2_id: string;
}>();
const checked = ref(false);
</script>

<template>
    <div>
        <div class="w-full flex justify-end">
            <shadcn-switch
                :checked
                @update:checked="checked = $event"
            >
                <template #thumb>
                    <Icon
                        :name="checked ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'"
                        class="text-emerald-600"
                    />
                </template>
            </shadcn-switch>
        </div>
        <match-stats-table
            v-if="!checked"
            :stats
            :p1_id
            :p1_name
            :p2_id
            :p2_name
        />
        <match-stats-chart
            v-else
            :stats
            :p1_name
            :p2_name
        />
    </div>
</template>
