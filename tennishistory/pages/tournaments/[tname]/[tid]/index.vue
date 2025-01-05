<script setup lang="ts">
// Anchors
const { scrollToAnchor } = useAnchorScroll();
const hash = ref("");

const scroll = (to: string) => {
    hash.value = to; // Set the hash value to the current link
    scrollToAnchor(to);
};

// Route/meta details
definePageMeta({ name: "tournament" });
const route = useRoute();
const tname = computed(() => route.params.tname);
const tid = computed(() => route.params.tid);
useHead({ title: unencodeName(tname.value) });

// API call
const { data: tournament, status, error } = await useFetch<TournamentType>("/api/getTournamentDetails", { query: { tid } });

const sidebarLinks = computed(() => {
    if (tournament.value) {
        return tournament.value.events.map((event) => ({
            label: event.year,
            to: `#${event.eid}`
        }));
    }
});
</script>

<template>
    <div>
        <tournament-breadcrumbs class="my-5" />
        <page-title>
            <template #heading>
                <div class="flex gap-3 items-center">
                    <span>{{ unencodeName(tname) }}</span>
                    <shadcn-button
                        v-if="tournament?.website"
                        as-child
                        variant="link"
                    >
                        <nuxt-link
                            :href="tournament.website"
                            target="_blank"
                        >
                            <Icon
                                name="ion:arrow-up-right-box-outline"
                                class="text-base text-emerald-600"
                            />
                        </nuxt-link>
                    </shadcn-button>
                </div>
            </template>
            <template
                #subheading
                v-if="tournament"
            >
                {{ tournament.years }}
            </template>
        </page-title>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <shadcn-scroll-area class="h-[40rem] w-[4rem] rounded-md px-3 text-center">
                    <div
                        v-for="link in sidebarLinks"
                        :key="link.label"
                        class="hover-link my-2 text-sm"
                        :class="{ 'text-emerald-600': hash === link.to }"
                        @click="scroll(link.to)"
                    >
                        {{ link.label }}
                    </div>
                </shadcn-scroll-area>
            </Teleport>
        </ClientOnly>
        <div
            v-if="tournament && tournament.events.length > 0"
            class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 lg:gap-10 mt-10"
        >
            <tournament-card
                v-for="event in tournament.events"
                :key="event.eid"
                :event
            />
        </div>
        <error-message
            v-else
            :status
            error-icon="material-symbols:error-circle-rounded-outline-sharp"
        >
            <template #loading-message>The tournament details are currently being fetched</template>
            <template #error-message>No tournament details available</template>
        </error-message>
    </div>
</template>
