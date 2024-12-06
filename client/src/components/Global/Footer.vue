<script setup>
import { Grid } from 'ant-design-vue';
const links = [{ name: "ATP", url: "https://www.atptour.com/en" }, { name: 'ITF', url: 'https://www.itftennis.com/en/' }, { name: 'Australian Open', url: 'https://ausopen.com/' }, { name: 'Roland Garros', url: 'https://www.rolandgarros.com/en-us' }, { name: 'Wimbledon', url: 'https://www.wimbledon.com/' }, { name: 'US Open', url: 'https://www.usopen.org/' }]

const useBreakpoint = Grid.useBreakpoint;
const screens = useBreakpoint();
</script>

<template>
    <div class="flex flex-col items-center">
        <div class="px-4 flex" :class="{ 'flex-col': screens.xs === true }">
            <router-link :to="{ name: 'about' }" class="hover-link text-center">About</router-link>
            <a class="hover-link mx-3 text-center" target="_blank" v-for="link in links" :key="link.name"
                :href="link.url">{{
                    link.name
                }}</a>
        </div>
        <div class="px-4 pt-2 pb-4 text-center text-zinc-300">Built by <a class="hover-link"
                href="https://www.claire-sheridan.com" target="_blank">Claire Sheridan</a> using Vue.js, Ant
            Design and Tailwind</div>
    </div>
</template>