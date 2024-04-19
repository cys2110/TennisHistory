<script setup>
import PlayerService from '@/services/PlayerService';
import { onMounted, ref, watch } from 'vue';
import { flagSrc, formatDate, formatCurrency, gladiator, headshot } from '@/components/utils';
import { useRoute, useRouter, RouterView, RouterLink } from 'vue-router';

const props = defineProps(['id'])
const player = ref(null)
const router = useRouter()
const route = useRoute()
const currentTab = ref(route.name)

const setCurrentTab = (tabName) => {
    currentTab.value = tabName
}

onMounted(() => {
    PlayerService.getPlayerById(props.id)
    .then(response => {
        player.value = response.data
    })
    .catch(error => console.log(error))
})

watch(() => router.currentRoute.value.params.id, () => {
        window.location.reload()
})
</script>

<template>
    <div class="view-container" v-if="player">
        <div class="heading-container">
            <div class="headings">
                <div class="heading">
                    <h1>{{ player.first_name }} {{ player.last_name.toUpperCase() }}</h1>
                    <div><img class="flag" :src="flagSrc(player.country)" :alt="player.country" /></div>
                </div>
                <div class="sub-heading">
                    <div class="badge" v-if="player.status">Active</div>
                </div>
                <div class="stats-container">
                    <div class="stat">
                        <div class="bold">{{ player.career_high }}</div>
                        <div>{{ formatDate(player.ch_date) }}</div>
                        <div>CAREER HIGH</div>
                    </div>
                    <div class="stat">
                        <div class="bold">{{ player.win }}-{{ player.loss }}</div>
                        <div>WIN-LOSS</div>
                    </div>
                    <div class="stat">
                        <div class="bold">{{ player.titles }}</div>
                        <div>TITLES</div>
                    </div>
                    <div class="stat">
                        <div class="bold">{{ formatCurrency('USD', player.pm_USD) }}</div>
                        <div>PRIZE MONEY</div>
                    </div>
                </div>
            </div>
            <div class="gladiator" v-if="player.gladiator || player.headshot">
                <img v-if="player.gladiator" class="picture" :src="gladiator(player.id)" :alt="player.full_name" />
                <img v-else class="picture" :src="headshot(player.id)" :alt="player.full_name" />
            </div>
        </div>

        <div class="tabs">
            <div :class="{'tab': true, 'active-tab': currentTab === 'PlayerOverview'}"><RouterLink class="tab-link" :to="{name: 'PlayerOverview'}" @click="setCurrentTab('PlayerOverview')">Overview</RouterLink></div>
            <div :class="{'tab': true, 'active-tab': currentTab === 'Titles'}"><RouterLink class="tab-link" :to="{name: 'Titles'}" @click="setCurrentTab('Titles')">Titles and Finals</RouterLink></div>
            <div :class="{'tab': true, 'active-tab': currentTab === 'WL Index'}"><RouterLink class="tab-link" :to="{name: 'WLIndex'}" @click="setCurrentTab('WL Index')">Win-loss Index</RouterLink></div>
        </div>

        <RouterView v-if="player" :player="player" />
    </div>
    <div v-else>Loading...</div>
</template>

<style scoped>
h1 {
    font-size: xx-large;
    font-weight: bolder;
}

.heading-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.headings {
    flex-grow: 3;
}

.details {
    display: flex;
    flex-direction: column;
    width: 100%
}

.heading {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.badge {
    background-color: var(--blue-border);
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    border-radius: 2rem;
    width: 5rem;
    margin-top: 1rem;
}

.flag {
    border-radius: 20%;
    margin-left: 2rem;
    width: 3rem;
}

.stats-container {
    display: flex;
    flex-direction: row;
    margin-top: 3rem;
    background-color: var(--blue-border);
    justify-content: space-evenly;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 10rem;
}

.stat {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.picture {
    border-radius: 50%;
    max-height: 20rem;
}

.bold {
    font-weight: bold;
    font-size: x-large;
}
</style>