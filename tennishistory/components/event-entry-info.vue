<script setup lang="ts">
const emits = defineEmits(["update:showMessage"]);
const route = useRoute();
const eid = ref(route.params.eid);

const handleResponse = ({ response }: { response: Response }) => {
    if (response.status === 204) emits("update:showMessage", "success");
};

const handleError = ({ error }: { error: any }) => {
    if (error) emits("update:showMessage", "error");
};

// API call
const { data, status, error } = await useFetch<EventEntryInfoType[]>("/api/getEventEntryInfo", {
    query: { eid },
    onResponse: handleResponse,
    onResponseError: handleError
});

watch(status, (newStatus) => {
    if (newStatus === "pending") {
        emits("update:showMessage", "pending");
    } else if (newStatus === "success") {
        emits("update:showMessage", false);
    } else {
        emits("update:showMessage", "error");
    }
});
</script>

<template>
    <prime-fieldset
        v-if="data"
        id="entry-info"
        legend="Entry Information"
        class="my-10 px-10 w-full"
    >
        <div class="w-full hidden md:flex justify-end mb-3">
            <ClientOnly>
                <shadcn-dialog clsas="w-3/4">
                    <shadcn-dialog-trigger>
                        <shadcn-toggle
                            variant="outline"
                            size="sm"
                        >
                            <Icon
                                name="icon-park-twotone:tree-diagram"
                                class="text-emerald-600"
                            />
                        </shadcn-toggle>
                    </shadcn-dialog-trigger>
                    <shadcn-dialog-content>
                        <shadcn-dialog-header>
                            <shadcn-dialog-title class="text-zinc-400">Entry Information</shadcn-dialog-title>
                        </shadcn-dialog-header>
                        <event-entry-info-chart :data />
                    </shadcn-dialog-content>
                </shadcn-dialog>
            </ClientOnly>
        </div>
        <shadcn-accordion
            type="multiple"
            collapsible
        >
            <shadcn-accordion-item
                v-for="(type, index) in data"
                :key="type.label"
                :value="`item-${index}`"
            >
                <shadcn-accordion-trigger>{{ type.label }}</shadcn-accordion-trigger>
                <shadcn-accordion-content>
                    <div
                        v-for="player in type.content"
                        :key="player.id"
                        class="flex gap-3 items-center w-full"
                    >
                        <div>
                            <Icon
                                v-if="getCountryCode(player.country)"
                                :name="`flag:${getCountryCode(player.country)}-4x3`"
                                class="text-sm rounded border border-zinc-400"
                            />
                            <component
                                v-else
                                :is="`Icons${player.country}`"
                            />
                        </div>
                        <div>
                            <shadcn-avatar class="border border-zinc-400">
                                <shadcn-avatar-image
                                    :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
                                    :alt="player.name"
                                    size="sm"
                                />
                                <shadcn-avatar-fallback>
                                    <Icon name="material-symbols:person-rounded" />
                                </shadcn-avatar-fallback>
                            </shadcn-avatar>
                        </div>
                        <div class="col-span-2">
                            <nuxt-link
                                class="hover-link text-sm"
                                :to="{ name: 'player', params: { pid: player.id, pname: encodeName(player.name) } }"
                            >
                                {{ player.name }}
                            </nuxt-link>
                        </div>
                        <div class="text-right text-sm ml-auto">{{ player.rank ?? player.reason }}</div>
                    </div>
                </shadcn-accordion-content>
            </shadcn-accordion-item>
        </shadcn-accordion>
    </prime-fieldset>
</template>
