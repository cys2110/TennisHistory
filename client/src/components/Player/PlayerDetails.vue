<script setup>
import { computed } from 'vue';
import { DateTime } from 'luxon';
import { convertToFt, encodeName, flag, formatDate, smallDate } from '@/utils/functions';

const cardTheme = { colorBgContainer: "#5b21b6" }
const props = defineProps(['player'])

const statistics = [
    { title: 'Career High', value: props.player.career_high ?? '—', description: props.player.ch_date ? formatDate(props.player.ch_date) : '—' },
    { title: 'Win-Loss', value: `${props.player.win}—${props.player.loss}` },
    { title: 'Titles', value: props.player.titles },
    { title: 'Prize Money', prefix: '$', value: props.player.pm_USD }
]

const playingHand = computed(() => {
    switch (props.player.rh) {
        case true:
            return "Right-handed"
        case false:
            return "Left-handed"
        default:
            return '—'
    }
})

const backhand = computed(() => {
    switch (props.player.bh1) {
        case true:
            return 'One-handed'
        case false:
            return 'Two-handed'
        default:
            return '—'
    }
})
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-row justify="space-evenly" :gutter=6>
            <a-col v-for="stat in statistics" :key="stat.title" :span=6>
                <a-card class="text-center h-full flex flex-col justify-between">
                    <a-statistic :title="stat.title" :prefix="stat.prefix || ''" :value="stat.value" />
                    <a-card-meta v-if="stat.description" :description="stat.description" />
                </a-card>
            </a-col>
        </a-row>
        <a-descriptions :colon="false" class="my-10 text-center bg-violet-800 rounded-lg" bordered layout="vertical"
            size="middle">
            <a-descriptions-item class="bg-black" label="Country">
                <div class="flex items-center justify-center">
                    <div class="w-10 mr-2">
                        <a-image class="rounded" :alt="player.countryConnection.edges[0].node.name"
                            :src="flag(player.countryConnection.edges[0].node.id)" />
                    </div>
                    <div>{{ player.countryConnection.edges[0].node.name }}</div>
                </div>
            </a-descriptions-item>
            <a-descriptions-item class="bg-black" label="Active">
                <div v-if="player.turned_pro && player.retired">
                    <div>{{ player.retired.id - player.turned_pro.id }} years</div>
                    <div>{{ player.turned_pro.id }}—{{ player.retired.id }}</div>
                </div>
                <div v-else-if="player.turned_pro">
                    <div>{{ parseInt(DateTime.now().year) - player.turned_pro.id + 1 }} years</div>
                    <div>{{ player.turned_pro.id }}—present</div>
                </div>
                <div v-else>—</div>
            </a-descriptions-item>
            <a-descriptions-item class="bg-black" label="Age">
                <div v-if="player.dob">
                    <div>{{ Math.floor(
                        Math.abs(
                            DateTime.fromISO(player.dob).diffNow("years").toObject().years
                        )
                    ) }}</div>
                    <div>{{ formatDate(player.dob) }}</div>
                </div>
                <div v-else>—</div>
            </a-descriptions-item>
            <a-descriptions-item class="bg-black" label="Height">
                <div>{{ player.height_cm }} cm</div>
                <div>{{ convertToFt(player.height_cm) }}</div>
            </a-descriptions-item>
            <a-descriptions-item class="bg-black" label="Plays">{{ playingHand }}</a-descriptions-item>
            <a-descriptions-item class="bg-black" label="Backhand">{{ backhand }}</a-descriptions-item>
            <a-descriptions-item class="bg-black" :label="player.coaches.length === 1 ? 'Coach' : 'Coaches'">
                <div v-if="player.coaches.length > 0" v-for="coach in player.coaches" :key="coach.id">
                    <router-link v-if="coach.full_name" class="hover-link"
                        :to="{ name: 'player', params: { name: encodeName(coach.full_name), id: coach.id } }">{{
                            coach.full_name }}</router-link>
                    <div v-else>{{ coach.id }}</div>
                </div>
                <div v-else>—</div>
            </a-descriptions-item>
            <a-descriptions-item class="bg-black" label="Previous Representations" :span="2">
                <div v-if="player.prev_countriesConnection.edges.length > 0"
                    v-for="country in player.prev_countriesConnection.edges" :key="country.node.id"
                    class="flex items-center justify-center">
                    <div class="w-10 mr-2 my-3">
                        <a-image :alt="country.node.name" :src="flag(country.node.id)" class="rounded-lg" />
                    </div>
                    <div class="mx-2 w-48">{{ country.node.name }}</div>
                    <div class="mx-2">
                        {{ smallDate(country.properties.start_date) }}—
                        {{ smallDate(country.properties.end_date) }}
                    </div>
                </div>
                <div v-else>—</div>
            </a-descriptions-item>
        </a-descriptions>
    </a-config-provider>
</template>