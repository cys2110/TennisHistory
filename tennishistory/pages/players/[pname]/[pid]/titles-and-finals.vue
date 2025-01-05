<script setup lang="ts">
definePageMeta({ name: "titles", layout: "player-layout" });
const route = useRoute();
const pid = computed(() => route.params.pid);
const checked = ref(false);

type resultsKeyType = "titles" | "finals";

// API call
const { data: results, status, error } = await useFetch<Record<resultsKeyType, TitlesFinalsType[]>>("/api/getTitlesAndFinals", { query: { pid } });
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
        <prime-toolbar class="hidden md:flex">
            <template #start>
                <div class="text-2xl text-zinc-400">{{ checked ? "Finals" : "Titles" }}</div>
            </template>
            <template #end>
                <shadcn-switch
                    :checked
                    @update:checked="checked = $event"
                >
                    <template #thumb>
                        <Icon
                            :name="checked ? 'pepicons-print:trophy-circle-off' : 'material-symbols:trophy-outline-rounded'"
                            class="text-emerald-600"
                        />
                    </template>
                </shadcn-switch>
            </template>
        </prime-toolbar>
        <event-timeline
            v-if="results"
            :events="checked ? results.finals : results.titles"
        />
        <error-message
            v-else
            :status
            error-icon="pepicons-print:trophy-circle-off"
        >
            <template #loading-message>Titles and finals are currently being fetched</template>
            <template #error-message>No titles or finals details available</template>
        </error-message>
    </div>
</template>
