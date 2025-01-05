<script setup lang="ts">
const route = useRoute();
const p1Name = computed(() => route.params.p1Name);
const p2Name = computed(() => route.params.p2Name);
const p1Id = computed(() => route.params.p1Id);
const p2Id = computed(() => route.params.p2Id);

useHead({ title: `${unencodeName(p1Name.value)} vs ${unencodeName(p2Name.value)}` });

// API call
const { data: h2h, status, error } = await useFetch<H2H>("/api/getH2H", { query: { p1Id, p2Id } });

const winLoss = computed(() => {
    if (h2h.value) {
        const totalMatches = h2h.value.matches.length;
        const p1Wins = h2h.value.matches.filter((match) => match.winner === p1Id.value).length;
        return [p1Wins, totalMatches - p1Wins];
    }
    return [0, 0];
});
</script>

<template>
    <div>
        <page-title>
            <template #heading>{{ unencodeName(p1Name) }} vs. {{ unencodeName(p2Name) }}</template>
            <template #subheading>Head to Head</template>
        </page-title>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <div class="flex flex-col justify-center gap-2">
                    <div>Player Profiles</div>
                    <nuxt-link
                        class="hover-link ml-5"
                        :to="`/players/${p1Name}/${p1Id}`"
                    >
                        {{ unencodeName(p1Name) }}
                    </nuxt-link>
                    <nuxt-link
                        class="hover-link ml-5"
                        :to="`/players/${p2Name}/${p2Id}`"
                    >
                        {{ unencodeName(p2Name) }}
                    </nuxt-link>
                </div>
            </Teleport>
        </ClientOnly>
        <div v-if="h2h">
            <div class="flex justify-evenly items-center">
                <div>
                    <h2h-player-card
                        :player="h2h.p1"
                        colour="border-violet-700 shadow-violet-500 hover:shadow-violet-500"
                    />
                </div>
                <div>
                    <h2h-doughnut-chart :winLoss />
                    <h2h-table :h2h />
                </div>
                <div>
                    <h2h-player-card
                        :player="h2h.p2"
                        colour="border-green-800 shadow-green-600 hover:shadow-green-600"
                    />
                </div>
            </div>
            <h2h-match-table :matches="h2h.matches" />
        </div>
        <error-message
            v-else
            :status
            error-icon="pepicons-print:people-circle-off"
        >
            <template #loading-message>The head to head is currently being fetched</template>
            <template #error-message>No head to head information available</template>
        </error-message>
    </div>
</template>
