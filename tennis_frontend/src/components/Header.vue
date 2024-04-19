<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHouse, faMagnifyingGlass } from '@fortawesome/pro-solid-svg-icons'
import { faCalendar } from '@fortawesome/pro-regular-svg-icons'
import { faPeopleArrows } from '@fortawesome/pro-duotone-svg-icons'
import { ref } from 'vue'
import Search from './Search.vue'

const openSearch = ref(false)

const toggleSearch = () => {
    openSearch.value = !openSearch.value
}
</script>

<template>
    <div>
        <h1>TennisHistory</h1>
    </div>
    <div class="nav">
        <RouterLink :to="{name: 'home'}"><FontAwesomeIcon class="navIcon" :icon="faHouse" /></RouterLink>
        <RouterLink :to="{name: 'Results Archive'}"><FontAwesomeIcon class="navIcon" :icon="faCalendar" /></RouterLink>
        <RouterLink :to="{name: 'H2H'}"><FontAwesomeIcon class="navIcon" :icon="faPeopleArrows" /></RouterLink>
        <FontAwesomeIcon class="navIcon" :icon="faMagnifyingGlass" @click="toggleSearch" />
    </div>
    <div class="search-container" v-if="openSearch" >
        <Search @close-search="toggleSearch" />
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap');

h1 {
    font-family: 'Fugaz One';
    color: var(--vt-c-text-dark-2)
}

.nav {
    width: 15rem;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

.navIcon {
    cursor: pointer;
    color: var(--vt-c-text-dark-2);
    font-size: large;
}

.search-container {
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 400;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--blur-background);
    backdrop-filter: blur(.125rem);
    top: 0;
    left: 0
}
</style>