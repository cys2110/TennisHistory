<script setup lang="ts">
definePageMeta({ name: "match" });

const route = useRoute();
const tname = computed(() => route.params.tname);
const year = computed(() => route.params.year);
const mid = computed(() => route.params.mid);
const eid = computed(() => route.params.eid);

const { data: match, status, error } = await useFetch("/api/getMatchDetails", { query: { mid, eid } });

const title = computed(() => {
    if (match.value) {
        return `${match.value.p1.name} v. ${match.value.p2.name} | ${unencodeName(tname.value)} ${year.value}`;
    }
    return `${unencodeName(tname.value)} ${year.value}`;
});
useHead({ title: title });

const pointStats = computed(() => {
    if (match.value) {
        return [match.value.service_stats, match.value.return, [...match.value.points_extra, ...match.value.points]];
    }
});
</script>

<template>
    <div>
        <div v-if="match">
            <tournament-breadcrumbs
                :round="match.round"
                :p1="match.p1.name"
                :p2="match.p2.name"
            />
            <page-title>
                <template #heading>{{ match.p1.name }} v. {{ match.p2.name }}</template>
                <template #subheading>{{ unencodeName(tname) }} {{ year }}</template>
            </page-title>
            <ClientOnly>
                <Teleport to="#right-sidebar">
                    <shadcn-scroll-area class="h-[40rem] w-[16rem] rounded-md px-3">
                        <div class="flex flex-col gap-2">
                            <div>Related pages</div>
                            <div class="ml-5 flex flex-col gap-2">
                                <nuxt-link
                                    class="hover-link"
                                    :to="`/h2h/${encodeName(match.p1.name)}-v-${encodeName(match.p2.name)}/${match.p1.id}-${match.p2.id}`"
                                    >Head to head</nuxt-link
                                >
                                <nuxt-link
                                    class="hover-link"
                                    :to="`/players/${encodeName(match.p1.name)}/${match.p1.id}`"
                                    >{{ match.p1.name }}</nuxt-link
                                >
                                <nuxt-link
                                    class="hover-link"
                                    :to="`/players/${encodeName(match.p2.name)}/${match.p2.id}`"
                                    >{{ match.p2.name }}</nuxt-link
                                >
                            </div>
                        </div>
                    </shadcn-scroll-area>
                </Teleport>
            </ClientOnly>
            <shadcn-tabs :default-value="0">
                <shadcn-tabs-list>
                    <shadcn-tabs-trigger :value="0">Details</shadcn-tabs-trigger>
                    <shadcn-tabs-trigger :value="1">Service Stats</shadcn-tabs-trigger>
                    <shadcn-tabs-trigger :value="2">Return Stats</shadcn-tabs-trigger>
                    <shadcn-tabs-trigger :value="3">Points Stats</shadcn-tabs-trigger>
                    <shadcn-tabs-trigger
                        v-if="match.service_speed"
                        :value="4"
                    >
                        Service Speed
                    </shadcn-tabs-trigger>
                </shadcn-tabs-list>
                <match-details :match />
                <shadcn-tabs-content :value="1">
                    <match-stats-panel
                        v-if="pointStats"
                        :stats="pointStats[0]"
                        :p1_name="match.p1.name"
                        :p1_id="match.p1.id"
                        :p2_name="match.p2.name"
                        :p2_id="match.p2.id"
                    />
                </shadcn-tabs-content>
                <shadcn-tabs-content :value="2">
                    <match-stats-panel
                        v-if="pointStats"
                        :stats="pointStats[1]"
                        :p1_name="match.p1.name"
                        :p1_id="match.p1.id"
                        :p2_name="match.p2.name"
                        :p2_id="match.p2.id"
                    />
                </shadcn-tabs-content>
                <shadcn-tabs-content :value="3">
                    <match-stats-panel
                        v-if="pointStats"
                        :stats="pointStats[2]"
                        :p1_name="match.p1.name"
                        :p1_id="match.p1.id"
                        :p2_name="match.p2.name"
                        :p2_id="match.p2.id"
                    />
                </shadcn-tabs-content>
                <service-speed
                    v-if="match.service_speed"
                    :stats="match.service_speed"
                    :p1_name="match.p1.name"
                    :p1_id="match.p1.id"
                    :p2_name="match.p2.name"
                    :p2_id="match.p2.id"
                />
            </shadcn-tabs>
        </div>
        <error-message
            v-else
            :status
            error-icon="material-symbols:error-circle-rounded-outline-sharp"
        >
            <template #loading-message>Match stats are currently being fetched</template>
            <template #error-message>No match stats available</template>
        </error-message>
    </div>
</template>
