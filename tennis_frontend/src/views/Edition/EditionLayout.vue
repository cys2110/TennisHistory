<script setup>
import EditionService from '@/services/EditionService';
import { onMounted, ref } from 'vue';
import { categorySrc, formattedDates, flagSrc } from '@/components/utils';
import { useRoute } from 'vue-router';
import MatchScoreService from '@/services/MatchScoreService';

const props = defineProps(['editionId'])
const edition = ref(null)
const matches = ref([])
const route = useRoute()
const currentTab = ref(route.name)

const setCurrentTab = (tabName) => {
    currentTab.value = tabName
}

onMounted(() => {
    EditionService.getEditionById(props.editionId)
    .then (response => {
        edition.value = response.data
        MatchScoreService.getMatchesByEdition(edition.value.id)
        .then (response => matches.value = response.data)
        .catch (error => console.log(error))
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <div class="view-container" v-if="edition && matches.length > 0">
        <div class="heading-container">
            <div class="category"><img class="filter" :src="categorySrc(edition.category)" /></div>
            <div class="heading">
                <h1>{{ edition.tournament_name }}</h1>
                <div class="sub-heading" v-if="edition.sponsor_name">{{ edition.sponsor_name }}</div>
                <div class="sub-heading">{{ formattedDates(edition.start_date, edition.end_date) }}</div>
            </div>
            <div class="flag-container"><img class="flag" :src="flagSrc(edition.country)" /></div>
        </div>
        <div class="tabs">
            <div :class="{'tab': true, 'active-tab': currentTab === 'EditionOverview'}">Overview</div>
            <div :class="{'tab': true, 'active-tab': currentTab === 'Draw'}">Draw</div>
            <div :class="{'tab': true, 'active-tab': currentTab === 'Results'}">Results</div>
        </div>
        <RouterView :edition="edition" :matches="matches"/>
    </div>
</template>