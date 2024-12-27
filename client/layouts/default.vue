<script setup>
import { breakpointsTailwind } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMediumAndUp = breakpoints.greaterOrEqual('md')
const visible = ref(false)

const menuItems = [
    { icon: 'i-ph-house-duotone', label: 'Home', to: '/' },
    { icon: 'i-ph-calendar-dots-duotone', label: 'Results Archive', to: '/archive' },
    { icon: 'i-material-symbols-swords-outline-rounded', label: 'Head to Head', to: '/h2h' },
    { icon: 'i-ph-magnifying-glass-duotone', label: 'Search', to: '/search' },
]

const footerLinks = [
    { name: 'ATP', url: 'https://www.atptour.com/en' },
    { name: 'ITF', url: 'https://www.itftennis.com/en/' },
    { name: 'Australian Open', url: 'https://ausopen.com/' },
    { name: 'Roland Garros', url: 'https://www.rolandgarros.com/en-us' },
    { name: 'Wimbledon', url: 'https://www.wimbledon.com/' },
    { name: 'US Open', url: 'https://www.usopen.org/' },
]
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gray-100 dark:bg-zinc-900">
        <div id="header"
            class="bg-violet-800 w-full flex justify-between items-center px-2 lg:px-10 py-3 sticky z-50 top-0">
            <div class="petit-font text-3xl text-zinc-300">TennisHistory</div>
            <ClientOnly>
                <u-horizontal-navigation v-if="isMediumAndUp" :links="menuItems"
                    :ui="{ icon: { base: 'text-base mx-1', active: 'text-zinc-300', inactive: 'text-zinc-400' }, base: 'text-base mx-2', active: 'text-zinc-300', inactive: 'text-zinc-400', wrapper: 'w-fit' }">
                    <template #default="{ link }">
                        <span>{{ link.label }}</span>
                    </template>
                </u-horizontal-navigation>
                <div v-else>
                    <Button class="border-none" @click="visible = !visible">
                        <template #icon>
                            <Icon name="solar:hamburger-menu-line-duotone" class="text-2xl text-zinc-400" />
                        </template>
                    </Button>
                    <Drawer v-model:visible="visible" header="Menu" position="bottom"
                        class="bg-violet-800 border-none !h-fit">
                        <u-vertical-navigation :links="menuItems"
                            :ui="{ icon: { base: 'text-base mx-1', active: 'text-zinc-300', inactive: 'text-zinc-400' }, base: 'text-base my-3', active: 'text-zinc-300', inactive: 'text-zinc-400', wrapper: 'w-fit' }">
                            <template #default="{ link }">
                                <span>{{ link.label }}</span>
                            </template>
                        </u-vertical-navigation>
                    </Drawer>
                </div>
            </ClientOnly>
        </div>
        <div class="flex-1 py-16 w-11/12 md:w-3/4 2xl:w-2/3 mx-auto">
            <slot />
            <scroll-top />
        </div>
        <div id="footer" class="bg-violet-800 flex flex-col items-center pt-3">
            <div class="px-4 flex flex-col md:flex-row justify-center items-center">
                <NuxtLink to="/about" class="hover-link text-sm text-zinc-300">About</NuxtLink>
                <NuxtLink class="hover-link mx-3 text-center text-sm text-zinc-300" target="_blank" external
                    v-for="link in footerLinks" :key="link.name" :to="link.url">{{ link.name }}</NuxtLink>
            </div>
            <div class="px-4 pt-2 pb-4 text-center text-zinc-300 flex items-center gap-2 flex-wrap justify-center">
                Built by
                <a class="hover-link !text-emerald-600 text-base" href="https://www.claire-sheridan.com"
                    target="_blank">Claire
                    Sheridan</a>
                using Nuxt, PrimeVue and TailwindCSS
            </div>
        </div>
    </div>
</template>

<style scoped>
.petit-font {
    font-family: 'Petit Formal Script', cursive;
}
</style>