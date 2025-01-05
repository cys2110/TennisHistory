<script setup lang="ts">
definePageMeta({ name: "player", layout: "player-layout" });
const route = useRoute();
const showMessage: Ref<string | boolean> = ref("");
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
        <player-overview @update:show-message="showMessage = $event" />
        <player-best-results @update:show-message="showMessage = $event" />
        <error-message
            v-if="showMessage === 'pending' || showMessage === 'error'"
            :status="showMessage"
            error-icon="material-symbols:person-off-outline-rounded"
        >
            <template #loading-message>Player details are currently being fetched</template>
            <template #error-message>No player information available</template>
        </error-message>
    </div>
</template>
