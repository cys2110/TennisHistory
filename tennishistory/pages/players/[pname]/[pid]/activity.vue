<script setup lang="ts">
definePageMeta({ name: "activity", layout: "player-layout" });
const route = useRoute();
const pid = computed(() => route.params.pid);
const year = ref();
const years: Ref<string[]> = ref([]);
const selectKey = ref(0);

// Anchors
const { scrollToAnchor } = useAnchorScroll();
const hash = ref("#details");

const scroll = (to: string) => {
    hash.value = to; // Set the hash value to the current link
    scrollToAnchor(to);
};

// API calls
const { data: activeYears, status: yearsStatus, error: yearsError } = await useFetch<{ start: { low: number; high: number }; end: { low: number; high: number } }>("/api/getPlayerActiveYears", { query: { pid } });

const { data: stats, status: statsStatus, error: statsError } = await useFetch<{ category: string; value: string }[]>("/api/getPlayerYearStats", { query: { pid, year }, immediate: false });

const { data: events, status, error } = await useFetch<PlayerActivityType[]>("/api/getPlayerActivity", { query: { pid, year }, immediate: false });

// Update select options for years
watch(
    () => activeYears.value,
    (newValue) => {
        if (newValue) {
            const yearsArray = Array.from({ length: newValue.end.low - newValue.start.low + 1 }, (_, index) => (newValue.start.low + index).toString());
            year.value = yearsArray[yearsArray.length - 1];
            years.value = yearsArray;
            selectKey.value++; // Update key to force select re-render
        }
    },
    { immediate: true }
);

const links = computed(() => {
    if (events.value) {
        return events.value.map((event) => ({
            label: event.name,
            route: `#${event.eid}`
        }));
    }
});
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <shadcn-scroll-area
                    class="h-[40rem] w-[16rem] rounded-md px-3 text-sm"
                    v-if="events"
                >
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
                    <div class="flex flex-col gap-2 mt-5">
                        <div class="font-bold">Tournaments</div>
                        <div
                            v-for="link in links"
                            :key="link.label"
                            class="hover-link ml-5"
                            :class="{ 'text-emerald-600': hash === link.route }"
                            @click="scroll(link.route)"
                        >
                            {{ link.label }}
                        </div>
                    </div>
                </shadcn-scroll-area>
            </Teleport>
        </ClientOnly>
        <prime-toolbar>
            <template #start>
                <prime-float-label
                    variant="on"
                    class="w-full mx-auto"
                >
                    <prime-select
                        input-id="year_select"
                        v-model="year"
                        :key="selectKey"
                        :options="years"
                        size="small"
                    >
                        <template #dropdownicon>
                            <Icon
                                name="material-symbols:arrow-drop-down-circle-outline"
                                class="text-lg"
                            />
                        </template>
                    </prime-select>
                    <label for="year_select">Year</label>
                </prime-float-label>
            </template>
        </prime-toolbar>
        <div class="h-full w-full">
            <div
                v-if="stats"
                class="w-full flex justify-evenly"
            >
                <prime-fieldset
                    v-for="stat in stats"
                    :key="stat.category"
                    :legend="stat.category"
                >
                    <div class="font-bold text-3xl text-center">{{ stat.value }}</div>
                </prime-fieldset>
            </div>
            <div v-if="events">
                <player-activity-card
                    v-for="event in events"
                    :key="event.eid"
                    :event
                    :year
                />
            </div>
            <error-message
                v-else
                :status="yearsStatus"
                error-icon="pepicons-print:calendar-circle-off"
            >
                <template #loading-message>Events are currently being fetched</template>
                <template #error-message>No events available</template>
            </error-message>
        </div>
    </div>
</template>
