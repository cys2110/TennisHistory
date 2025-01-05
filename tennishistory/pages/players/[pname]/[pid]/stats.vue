<script setup lang="ts">
definePageMeta({ name: "stats", layout: "player-layout" });
const route = useRoute();
const pid = computed(() => route.params.pid);
const visible = ref(false);
const selectedYears: Ref<string[]> = ref([]);
const years: Ref<string[]> = ref([]);
const selectKey = ref(0);
const selectedSurfaces = ref(["Clay", "Grass", "Hard", "Carpet"]);
const surfaces = ["Clay", "Grass", "Hard", "Carpet"];

// API calls
const { data: activeYears, status: yearsStatus, error: yearsError } = await useFetch<{ start: { low: number; high: number }; end: { low: number; high: number } }>("/api/getPlayerActiveYears", { query: { pid } });
const { data: stats, status, error } = await useFetch<PlayerStatsType[]>("/api/getPlayerStats", { query: { pid, years, surfaces }, immediate: false });

// Update select options for years
watch(
    () => activeYears.value,
    (newValue) => {
        if (newValue) {
            const yearsArray = Array.from({ length: newValue.end.low - newValue.start.low + 1 }, (_, index) => (newValue.start.low + index).toString());
            selectedYears.value = yearsArray; // Set starting selection of years to career
            years.value = yearsArray;
            selectKey.value++; // Update select key to force re-render of multi-select
        }
    },
    { immediate: true }
);
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <shadcn-scroll-area class="h-[40rem] w-[16rem] rounded-md px-3 text-sm">
                    <div class="flex flex-col gap-2">
                        <div class="font-bold">Player pages</div>
                        <nuxt-link
                            v-for="page in PLAYER_PAGES"
                            :key="page.title"
                            :to="`/players/${route.params.pname}/${route.params.pid}/${page.route}`"
                            class="hover-link flex gap-1 items-center ml-5"
                            exact-active-class="text-emerald-600"
                        >
                            <Icon :name="page.icon" />
                            <span>{{ page.title }}</span>
                        </nuxt-link>
                    </div>
                </shadcn-scroll-area>
            </Teleport>
        </ClientOnly>
        <prime-toolbar>
            <template
                #start
                v-if="activeYears"
            >
                <prime-float-label variant="on">
                    <prime-multi-select
                        :key="selectKey"
                        display="chip"
                        inputId="year_select"
                        v-model="selectedYears"
                        :options="years"
                        size="small"
                        filter
                        class="max-w-1/3"
                    >
                        <template #dropdownicon>
                            <Icon
                                name="material-symbols:arrow-drop-down-circle-outline"
                                class="text-lg text-zinc-400"
                            />
                        </template>
                    </prime-multi-select>
                    <label for="year_select">Year</label>
                </prime-float-label>
            </template>
            <template #center>
                <prime-select-button
                    v-model="selectedSurfaces"
                    :options="surfaces"
                    multiple
                    class="!text-zinc-800"
                />
            </template>
            <template #end>
                <shadcn-toggle
                    variant="outline"
                    size="sm"
                >
                    <Icon
                        :name="visible ? 'ph:table-duotone' : 'material-symbols:bar-chart-4-bars-rounded'"
                        class="text-2xl"
                    />
                </shadcn-toggle>
            </template>
        </prime-toolbar>
        <div v-if="stats">
            <player-stats-table
                v-if="!visible"
                :stats
            />
            <player-stats-chart
                v-else
                :stats
            />
        </div>
        <error-message
            v-else
            :status="yearsStatus"
            error-icon="material-symbols:bar-chart-off-rounded"
        >
            <template #loading-message>Player stats are currently being fetched</template>
            <template #error-message>No player stats available</template>
        </error-message>
    </div>
</template>

<style scoped>
:deep(.p-chip-remove-icon) {
    @apply text-zinc-500 dark:text-zinc-400;
}
</style>
