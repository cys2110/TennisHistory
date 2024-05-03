<script setup>
import { headshot, flagSrc } from '../utils';
import { useRouter, RouterLink } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const props = defineProps(['player'])
const router = useRouter()
const { mdAndDown } = useDisplay()

const navigate = (id, name) => {
    router.push({name: 'Player', params: { id: id, name: name}})
}
</script>

<template>
    <tr>
        <td class="d-flex align-center pl-7">
            <v-avatar
                :size="xs ? 'x-small' : 'small'"
                class="my-1"
            >
                <v-img
                    v-if="player.Player.headshot"
                    :src="headshot(player.PlayerId)"
                    @click="navigate(player.PlayerId, player.Player.full_name)"
                />
            </v-avatar>
            <div
                class="mx-3"
                :style="mdAndDown ? 'min-width: 30%' : 'width: 10%'"
            >
                <flag-img
                    :src="flagSrc(player.Player.country)"
                />
            </div>
            <RouterLink class="hover-link" :to="{name: 'Player', params: {id: player.PlayerId, name: player.Player.full_name}}">{{ player.Player.full_name }}</RouterLink>
        </td>
        <td>
            <slot name="reason"></slot>
        </td>
    </tr>
</template>