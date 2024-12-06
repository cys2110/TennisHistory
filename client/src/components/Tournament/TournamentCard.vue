<script setup>
const props = defineProps(['event', 'id', 'name'])
const final = props.event.rounds[0].matches[0]

// router-link params
const eventParams = {
    name: props.name,
    id: props.id,
    year: props.event.year.id,
    eid: props.event.id
}
const matchParams = { ...eventParams, mid: final.match_no }
</script>

<template>
    <a-card class="full-card">
        <template #title>
            <router-link class="hover-link font-bold" :to="{ name: 'event', params: eventParams }">
                {{ event.year.id }}
            </router-link>
        </template>
        <a-card-meta class="text-center">
            <template #title>
                <PlayerRow :player="final.winner.player.player" class="items-center mb-2" />
                <a-row class="justify-center">d.</a-row>
                <PlayerRow :player="final.loser.player.player" class="items-center mt-2" />
            </template>
            <template #description>
                <router-link :to="{ name: 'match', params: matchParams }">
                    <WinnerScore :winner="final.winner" :loser="final.loser" />
                </router-link>
            </template>
        </a-card-meta>
    </a-card>
</template>