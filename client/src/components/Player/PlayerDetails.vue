<script setup>
import { computed, markRaw, onMounted, ref, shallowRef, toRefs } from 'vue';
import Icon from '@ant-design/icons-vue';
import { DateTime } from 'luxon';
import { convertToFt, encodeName, formatDate, smallDate } from '@/utils/functions';

const props = defineProps(['player'])
const { countryConnection, prev_countriesConnection, turned_pro, retired, dob, rh, bh1, height_cm, coaches, career_high, ch_date, win, loss, titles, pm_USD } = toRefs(props.player)
const selectedFlag = shallowRef(null)
const olderFlags = ref([])

onMounted(async () => {
    const countryCode = countryConnection.value.edges[0].node.id;
    try {
        selectedFlag.value = (
            await import(`@/components/icons/flags`)
        )[countryCode] || null;
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error);
    }
    if (prev_countriesConnection.value.edges.length > 0) {
        for (const country of prev_countriesConnection.value.edges) {
            const countryCode = country.node.id;
            try {
                const flag = markRaw(
                    (await import(`@/components/icons/flags`))[countryCode] || null
                );
                olderFlags.value.push(flag);
            } catch (error) {
                console.error(`Flag for ${countryCode} not found`, error);
                olderFlags.value.push(null);
            }
        }
    }
});

const statistics = [
    { title: 'Career High', value: career_high.value ?? '—', description: ch_date.value ? formatDate(ch_date.value) : '—' },
    { title: 'Win-Loss', value: `${win.value}—${loss.value}` },
    { title: 'Titles', value: titles.value },
    { title: 'Prize Money', prefix: '$', value: pm_USD.value }
]

const playerYears = computed(() => {
    if (turned_pro.value && retired.value) {
        return `${retired.value.id - turned_pro.value.id} years`
    } else {
        return `${parseInt(DateTime.now().year) - turned_pro.value.id + 1} years`
    }
})

const age = computed(() => { return Math.floor(Math.abs(DateTime.fromISO(dob.value).diffNow("years").toObject().years)) })

const playingHand = computed(() => {
    switch (rh.value) {
        case true:
            return "Right-handed"
        case false:
            return "Left-handed"
        default:
            return '—'
    }
})

const backhand = computed(() => {
    switch (bh1.value) {
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
    <a-row justify="space-evenly" :gutter="[5, 16]">
        <a-col v-for="stat in statistics" :key="stat.title" :xs="24" :md="11" :xl="5">
            <a-card class="text-center full-card">
                <a-statistic :title="stat.title" :prefix="stat.prefix || ''" :value="stat.value" />
                <a-card-meta v-if="stat.description" :description="stat.description" />
            </a-card>
        </a-col>
    </a-row>
    <a-descriptions :colon="false" class="my-10 text-center bg-violet-800 rounded-lg" bordered layout="vertical"
        size="middle">
        <a-descriptions-item class="bg-black" label="Country">
            <div class="flex items-center justify-center">
                <Icon v-if="selectedFlag" class="mr-2 text-2xl" :component="selectedFlag" />
                <div>{{ countryConnection.edges[0].node.name }}</div>
            </div>
        </a-descriptions-item>
        <a-descriptions-item class="bg-black" label="Active">
            <div v-if="turned_pro && retired">
                <div>{{ playerYears }}</div>
                <div>{{ turned_pro.id }}—{{ retired.id }}</div>
            </div>
            <div v-else-if="player.turned_pro">
                <div>{{ playerYears }}</div>
                <div>{{ turned_pro.id }}—present</div>
            </div>
            <div v-else>—</div>
        </a-descriptions-item>
        <a-descriptions-item class="bg-black" label="Age">
            <div v-if="dob">
                <div>{{ age }}</div>
                <div>{{ formatDate(dob) }}</div>
            </div>
            <div v-else>—</div>
        </a-descriptions-item>
        <a-descriptions-item class="bg-black" label="Height">
            <div>{{ height_cm }} cm</div>
            <div>{{ convertToFt(height_cm) }}</div>
        </a-descriptions-item>
        <a-descriptions-item class="bg-black" label="Plays">{{ playingHand }}</a-descriptions-item>
        <a-descriptions-item class="bg-black" label="Backhand">{{ backhand }}</a-descriptions-item>
        <a-descriptions-item class="bg-black" :label="coaches.length === 1 ? 'Coach' : 'Coaches'">
            <div v-if="coaches.length > 0" v-for="coach in coaches" :key="coach.id">
                <router-link v-if="coach.full_name" class="hover-link"
                    :to="{ name: 'player', params: { name: encodeName(coach.full_name), id: coach.id } }">{{
                        coach.full_name }}</router-link>
                <div v-else>{{ coach.id }}</div>
            </div>
            <div v-else>—</div>
        </a-descriptions-item>
        <a-descriptions-item class="bg-black" label="Previous Representations" :span="2">
            <a-row v-if="prev_countriesConnection.edges.length > 0"
                v-for="(country, index) in prev_countriesConnection.edges" :key="country.node.id"
                class="flex items-center justify-center">
                <a-col :span="2">
                    <Icon v-if="olderFlags.length > 0 && olderFlags[index]" class="mr-2 text-2xl"
                        :component="olderFlags[index]" />
                </a-col>
                <a-col :span="9">{{ country.node.name }}</a-col>
                <a-col :span="13">
                    {{ smallDate(country.properties.start_date) }}—
                    {{ smallDate(country.properties.end_date) }}
                </a-col>
            </a-row>
            <div v-else>—</div>
        </a-descriptions-item>
    </a-descriptions>
</template>