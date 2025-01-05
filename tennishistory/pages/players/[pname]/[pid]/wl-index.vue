<script setup lang="ts">
definePageMeta({ name: "wl-index", layout: "player-layout" });
const route = useRoute();
const pid = computed(() => route.params.pid);
const checked = ref(false);

// API call
const { data: wlindex, status, error } = await useFetch<PlayerWLIndexType[]>("/api/getWLIndex", { query: { pid } });

const index = computed(() => {
    if (wlindex.value) {
        const formattedIndex = wlindex.value.map((indice) => ({
            ...indice,
            wins: indice.wins,
            losses: indice.losses,
            titles: indice.titles || null,
            value: indice.wins === "0" && indice.losses === "0" ? 0 : parseFloat((parseInt(indice.wins) / (parseInt(indice.wins) + parseInt(indice.losses))).toFixed(3))
        }));
        return formattedIndex;
    }
});
</script>

<template>
    <div>
        <ClientOnly>
            <Teleport to="#right-sidebar">
                <shadcn-scroll-area class="h-fit max-h-[40rem] w-[16rem] rounded-md px-3 text-sm">
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
        <div v-if="wlindex">
            <prime-toolbar class="hidden md:flex">
                <template #end>
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
                </template>
            </prime-toolbar>
            <wlindex-table
                v-if="!checked && index"
                :index
            />
            <wlindex-chart
                v-else-if="index"
                :index
            />
        </div>
        <error-message
            v-else
            :status
            error-icon="material-symbols:bar-chart-off-rounded"
        >
            <template #loading-message>The index is currently being fetched</template>
            <template #error-message>No index available</template>
        </error-message>
    </div>
</template>
