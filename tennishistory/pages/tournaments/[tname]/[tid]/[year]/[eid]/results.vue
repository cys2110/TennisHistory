<script setup lang="ts">
definePageMeta({ name: "results", layout: "event-layout" });
const route = useRoute();
const eid = ref(route.params.eid);

// API call
const { data: results, status, error } = await useFetch<EventResultsType[]>("/api/getResults", { query: { eid } });
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <shadcn-scroll-area class="h-[40rem] w-[16rem] rounded-md px-3 text-sm">
                    <div class="flex flex-col gap-2">
                        <div class="font-bold">Event pages</div>
                        <nuxt-link
                            v-for="page in EVENT_PAGES"
                            :key="page.title"
                            :to="`/tournaments/${route.params.tname}/${route.params.tid}/${route.params.year}/${route.params.eid}/${page.route}`"
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
        <prime-stepper
            v-if="results && results.length > 0"
            :value="SHORT_ROUNDS[results[0].round as keyof typeof SHORT_ROUNDS]"
        >
            <prime-step-list>
                <prime-step
                    v-for="round in results"
                    :key="round.round"
                    :value="SHORT_ROUNDS[round.round as keyof typeof SHORT_ROUNDS]"
                />
            </prime-step-list>
            <prime-step-panels>
                <prime-step-panel
                    v-for="(round, index) in results"
                    :key="index"
                    :value="SHORT_ROUNDS[round.round as keyof typeof SHORT_ROUNDS]"
                >
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-y-8 md:gap-x-12 mt-5">
                        <template
                            v-for="match in round.matches"
                            :key="match.mid"
                        >
                            <result-card :match />
                        </template>
                    </div>
                </prime-step-panel>
            </prime-step-panels>
        </prime-stepper>
        <error-message
            v-else
            :status
            error-icon="material-symbols:error-circle-rounded-outline-sharp"
        >
            <template #loading-message>The event results are currently being fetched</template>
            <template #error-message>No results available</template>
        </error-message>
    </div>
</template>
