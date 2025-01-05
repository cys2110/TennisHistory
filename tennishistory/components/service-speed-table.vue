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
</script>

<template>
    <shadcn-table>
        <shadcn-table-header>
            <shadcn-table-row>
                <shadcn-table-head class="flex items-center">
                    <div>
                        <shadcn-avatar
                            class="border border-zinc-400"
                            size="sm"
                        >
                            <shadcn-avatar-image
                                :src="`https://www.atptour.com/-/media/alias/player-headshot/${p1_id}`"
                                :alt="p1_name"
                            />
                            <shadcn-avatar-fallback>
                                <Icon name="material-symbols:person-rounded" />
                            </shadcn-avatar-fallback>
                        </shadcn-avatar>
                    </div>
                </shadcn-table-head>
                <shadcn-table-head>Category</shadcn-table-head>
                <shadcn-table-head class="flex items-center">
                    <div>
                        <shadcn-avatar
                            class="border border-zinc-400"
                            size="sm"
                        >
                            <shadcn-avatar-image
                                :src="`https://www.atptour.com/-/media/alias/player-headshot/${p2_id}`"
                                :alt="p2_name"
                            />
                            <shadcn-avatar-fallback>
                                <Icon name="material-symbols:person-rounded" />
                            </shadcn-avatar-fallback>
                        </shadcn-avatar>
                    </div>
                </shadcn-table-head>
            </shadcn-table-row>
        </shadcn-table-header>
        <shadcn-table-body>
            <shadcn-table-row
                v-for="stat in stats"
                :key="stat.name"
            >
                <shadcn-table-cell>
                    <div class="flex flex-col">
                        <div :class="{ 'font-bold': stat.p1.low > stat.p2.low }">{{ stat.p1.low }} km/h</div>
                        <div :class="{ 'font-bold': stat.p1.low > stat.p2.low }">{{ (stat.p1.low / 1.609344).toFixed(0) }} mph</div>
                    </div>
                </shadcn-table-cell>
                <shadcn-table-cell>{{ stat.name }}</shadcn-table-cell>
                <shadcn-table-cell>
                    <div class="flex flex-col">
                        <div :class="{ 'font-bold': stat.p2.low > stat.p1.low }">{{ stat.p2.low }} km/h</div>
                        <div :class="{ 'font-bold': stat.p2.low > stat.p1.low }">{{ (stat.p2.low / 1.609344).toFixed(0) }} mph</div>
                    </div>
                </shadcn-table-cell>
            </shadcn-table-row>
        </shadcn-table-body>
    </shadcn-table>
</template>
