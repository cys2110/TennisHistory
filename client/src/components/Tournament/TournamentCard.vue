<script setup>
const cardTheme = { colorBgContainer: "#5b21b6" }

const props = defineProps(['event', 'id', 'name'])
const final = props.event.rounds[0].matches[0]
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card>
            <template #title>
                <router-link class="hover-link"
                    :to="{ name: 'event', params: { name: name, id: id, year: event.year.id, eid: event.id } }">{{
                        event.year.id }}</router-link>
            </template>
            <a-card-meta class="text-center">
                <template #title>
                    <a-row class="items-center mb-2">
                        <PlayerRow :player="final.winner.player.player" />
                    </a-row>
                    <a-row class="justify-center">d.</a-row>
                    <a-row class="items-center mt-2">
                        <PlayerRow :player="final.loser.player.player" />
                    </a-row>
                </template>
                <template #description>
                    <WinnerScore :winner="final.winner" :loser="final.loser" />
                </template>
            </a-card-meta>
        </a-card>
    </a-config-provider>
</template>