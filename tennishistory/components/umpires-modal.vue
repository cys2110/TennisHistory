<script setup lang="ts">
const props = defineProps<{ id: string }>();

const { data: matches, status, error } = await useFetch("/api/getUmpireResults", { query: { id: props.id } });
</script>

<template>
    <div
        v-if="matches"
        class="grid grid-cols-3 gap-5"
    >
        <prime-fieldset
            v-for="event in matches"
            :key="event.eid"
            class="border-emerald-600"
        >
            <template #legend>
                <nuxt-link
                    class="text-zinc-400 hover-link font-bold"
                    :to="`/tournaments/${encodeName(event.tname)}/${event.tid}/${event.year}/${event.eid}`"
                >
                    {{ event.tname }} {{ event.year }}
                </nuxt-link>
            </template>
            <div
                v-for="round in event.rounds"
                :key="round.round"
            >
                <div class="text-zinc-300 text-base">{{ round.round }}</div>
                <div
                    v-for="match in round.matches"
                    :key="match.match_no"
                    class="ml-3"
                >
                    <nuxt-link
                        v-if="match.match_no"
                        class="hover-link text-zinc-400"
                        :to="`/tournaments/${encodeName(event.tname)}/${event.tid}/${event.year}/${event.eid}/${match.match_no}`"
                    >
                        {{ match.p1 }} v. {{ match.p2 }}
                    </nuxt-link>
                </div>
            </div>
        </prime-fieldset>
    </div>
</template>
