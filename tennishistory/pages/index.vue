<script setup lang="ts">
definePageMeta({ name: "home" });
useHead({ title: "Upcoming Tournaments" });

// Anchors
const { scrollToAnchor } = useAnchorScroll();
const hash = ref("");

const scroll = (to: string) => {
    hash.value = to; // Set the hash value to the current link
    scrollToAnchor(to);
};

// Filters
const baseOption = { label: "All", value: "All" };

// Surface filter
const surface = ref("All");
const surfaces = [baseOption, { label: "Clay", value: "Clay" }, { label: "Grass", value: "Grass" }, { label: "Hard", value: "Hard" }, { label: "Carpet", value: "Carpet" }];

// Month filter
const month = ref("All");
const baseMonths = MONTHS.map((month, index) => ({ label: month, value: index + 1 }));
const months = [baseOption, ...baseMonths];

// Category filter
const category = ref("All");
const baseCategories = CATEGORIES.map((category) => ({ label: category, value: category }));
const categories = [baseOption, ...baseCategories];

const selectOptions = [
    { vModel: category, options: categories, label: "Category" },
    { vModel: month, options: months, label: "Month" },
    { vModel: surface, options: surfaces, label: "Surface" }
];

// API call to get upcoming tournaments
const { data: events, status, error } = await useFetch<EventCardType[]>("/api/getUpcomingTournaments", { query: { category, month, surface } });

const sidebarLinks = computed(() => {
    if (events.value) {
        return events.value.map((event) => ({
            label: event.tname,
            to: `#${event.eid}`
        }));
    }
});
</script>

<template>
    <div id="home-page">
        <page-title>
            <template #heading>Upcoming Tournaments</template>
        </page-title>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <shadcn-scroll-area class="h-[40rem] w-[16rem] rounded-md px-3">
                    <div
                        v-for="link in sidebarLinks"
                        :key="link.label"
                        role="button"
                        tabindex="0"
                        class="hover-link my-2 text-sm"
                        :class="{ 'text-emerald-600': hash === link.to }"
                        @click="scroll(link.to)"
                        @keydown.enter="scroll(link.to)"
                    >
                        {{ link.label }}
                    </div>
                </shadcn-scroll-area>
            </Teleport>
        </ClientOnly>
        <prime-toolbar>
            <template #start>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    <prime-float-label
                        v-for="(select, index) in selectOptions"
                        :key="select.label"
                        class="w-full"
                        variant="on"
                    >
                        <prime-select
                            :inputId="`select-${index}`"
                            v-model="select.vModel"
                            :options="select.options"
                            option-label="label"
                            option-value="value"
                            class="text-center w-full"
                            size="small"
                        >
                            <template #dropdownicon>
                                <Icon
                                    name="material-symbols:arrow-drop-down-circle-outline"
                                    class="text-lg"
                                />
                            </template>
                        </prime-select>
                        <label :for="`select-${index}`">{{ select.label }}</label>
                    </prime-float-label>
                </div>
            </template>
        </prime-toolbar>
        <div
            v-if="events && events.length > 0"
            class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-10 mt-5"
        >
            <ClientOnly>
                <event-card
                    v-for="event in events"
                    :key="event.eid"
                    :event="event"
                />
            </ClientOnly>
        </div>
        <error-message
            v-else
            :status
            error-icon="pepicons-print:calendar-circle-off"
        >
            <template #loading-message>Events are currently being fetched</template>
            <template #error-message>There are no upcoming events</template>
        </error-message>
    </div>
</template>
