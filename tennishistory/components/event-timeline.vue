<script setup lang="ts">
const props = defineProps<{ events: TitlesFinalsType[] }>();
const flattenedEvents = computed(() => {
    let eventArray: { surface: string; eid: string; date: string; tid: string; tname: string }[] = [];
    for (let i = 0; i < props.events.length; i++) {
        eventArray = eventArray.concat(props.events[i].events);
    }
    return eventArray;
});
</script>

<template>
    <div>
        <prime-timeline
            v-if="events.length > 0"
            :value="events"
            layout="horizontal"
            align="bottom"
        >
            <template #opposite="{ item }">
                <span class="text-zinc-400">{{ item.events.length }}</span>
            </template>
            <template #content="{ item }">
                <span class="font-bold text-zinc-300">{{ item.year }}</span>
            </template>
        </prime-timeline>
        <prime-timeline
            :value="flattenedEvents"
            class="w-2/3 mx-auto my-10"
        >
            <template #opposite="{ item }">
                <span class="text-zinc-400">{{ item.date }}</span>
            </template>
            <template #content="{ item }">
                <div class="flex flex-col gap-2">
                    <div class="font-bold">
                        <nuxt-link
                            class="hover-link"
                            :to="`/tournaments/${encodeName(item.tname)}/${item.tid}`"
                        >
                            {{ item.tname }}
                        </nuxt-link>
                    </div>
                    <div class="text-zinc-400">{{ item.surface }}</div>
                </div>
            </template>
        </prime-timeline>
    </div>
</template>
