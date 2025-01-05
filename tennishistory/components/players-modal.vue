<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations";
const props = defineProps<{
    id: string;
    type: string;
}>();

const apiRoute = computed(() => {
    switch (props.type) {
        case "Coaches":
            return "/api/getCoachResults";
        case "Countries":
            return "/api/getCountryResults";
        default:
            return "";
    }
});

const { data: players, status, error } = await useFetch(apiRoute.value, { query: { id: props.id } });

const selectedArray = computed(() => {
    if (players.value) {
        switch (props.type) {
            case "Countries":
                return players.value.players;
            case "Coaches":
                return players.value;
            default:
                return null;
        }
    }
    return null;
});
</script>

<template>
    <div
        v-if="players"
        class="grid grid-cols-3 gap-5 overflow-y-auto"
    >
        <div
            v-if="type === 'Countries'"
            class="col-span-3 text-xl text-zinc-400"
        >
            Current/Retired Players
        </div>
        <div
            v-for="player in selectedArray"
            :key="player.id"
            class="p-5 flex items-center justify-center border border-solid border-emerald-600 rounded-xl"
        >
            <NuxtLink
                class="hover-link text-zinc-300"
                :to="{ name: 'player', params: { pname: useChangeCase(player.name, 'snakeCase').value, pid: player.id } }"
            >
                {{ player.name }}
            </NuxtLink>
        </div>
        <div
            v-if="type === 'Countries'"
            class="col-span-3 text-xl text-zinc-400"
        >
            Former players
        </div>
        <div
            v-if="type === 'Countries'"
            v-for="player in players.former"
            :key="player.id"
            class="p-5 flex items-center justify-center border border-solid border-emerald-600 rounded-xl"
        >
            <NuxtLink
                class="hover-link text-zinc-300"
                :to="{ name: 'player', params: { pname: useChangeCase(player.name, 'snakeCase').value, pid: player.id } }"
            >
                {{ player.name }}
            </NuxtLink>
        </div>
    </div>
</template>
