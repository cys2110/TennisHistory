<script setup>
const links = [{ name: "ATP", url: "https://www.atptour.com/en" }, { name: 'ITF', url: 'https://www.itftennis.com/en/' }, { name: 'Australian Open', url: 'https://ausopen.com/' }, { name: 'Roland Garros', url: 'https://www.rolandgarros.com/en-us' }, { name: 'Wimbledon', url: 'https://www.wimbledon.com/' }, { name: 'US Open', url: 'https://www.usopen.org/' }]
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="px-4 flex">
            <router-link :to="{ name: 'about' }" class="hover-link">About</router-link>
            <a class="hover-link mx-3" target="_blank" v-for="link in links" :key="link.name" :href="link.url">{{
                link.name
            }}</a>
        </div>
        <div class="px-4 pt-2 pb-4 text-center text-zinc-300">Built by <a class="hover-link"
                href="https://www.claire-sheridan.com" target="_blank">Claire Sheridan</a> using Vue.js, Ant
            Design and Tailwind <!--[EDIT TECH STACH]--></div>
    </div>
</template>