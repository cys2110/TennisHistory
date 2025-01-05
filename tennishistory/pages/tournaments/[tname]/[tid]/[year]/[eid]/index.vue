<script setup lang="ts">
definePageMeta({ name: "event", layout: "event-layout" });
const route = useRoute();
const showMessage = ref<string | boolean>("success");
const menuItems = ref([
    { route: "#details", label: "Event Details" },
    { route: "#awards", label: "Awards" },
    { route: "#seeds", label: "Seeds" },
    { route: "#entry-info", label: "Entry Information" },
    { route: "#entries", label: "Entries" }
]);

// Anchors
const { scrollToAnchor } = useAnchorScroll();
const hash = ref("#details");

const scroll = (to: string) => {
    hash.value = to; // Set the hash value to the current link
    scrollToAnchor(to);
};
</script>

<template>
    <div class="my-10">
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
                    <div class="flex flex-col gap-2 mt-5">
                        <div class="font-bold">Go to</div>
                        <div
                            v-for="item in menuItems"
                            :key="item.label"
                            class="hover-link ml-5"
                            :class="{ 'text-emerald-600': hash === item.route }"
                            @click="scroll(item.route)"
                        >
                            {{ item.label }}
                        </div>
                    </div>
                </shadcn-scroll-area>
            </Teleport>
        </ClientOnly>
        <event-overview @update:show-message="showMessage = $event" />
        <div class="flex flex-col md:flex-row gap-5 justify-evenly">
            <div>
                <event-awards @update:show-message="showMessage = $event" />
                <event-entry-info @update:show-message="showMessage = $event" />
            </div>
            <div>
                <event-seeds @update:show-message="showMessage = $event" />
            </div>
        </div>
        <event-entries @update:show-message="showMessage = $event" />
        <error-message
            v-if="showMessage === 'pending' || showMessage === 'error'"
            :status="showMessage"
            error-icon="material-symbols:error-circle-rounded-outline-sharp"
        >
            <template #loading-message>The event details are currently being fetched</template>
            <template #error-message>No event information available</template>
        </error-message>
    </div>
</template>
