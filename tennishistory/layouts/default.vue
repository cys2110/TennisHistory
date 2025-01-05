<script setup>
const menuItems = [
    { icon: "ph:house-duotone", label: "Home", to: "/" },
    { icon: "ph:calendar-dots-duotone", label: "Results Archive", to: "/archive" },
    { icon: "material-symbols:swords-outline-rounded", label: "Head to Head", to: "/h2h" },
    { icon: "ph:magnifying-glass-duotone", label: "Search", to: "/search" },
    { icon: "material-symbols:info-outline-rounded", label: "About", to: "/about" }
];

const footerLinks = [
    { name: "ATP", url: "https://www.atptour.com/en" },
    { name: "ITF", url: "https://www.itftennis.com/en/" },
    { name: "Australian Open", url: "https://ausopen.com/" },
    { name: "Roland Garros", url: "https://www.rolandgarros.com/en-us" },
    { name: "Wimbledon", url: "https://www.wimbledon.com/" },
    { name: "US Open", url: "https://www.usopen.org/" }
];
</script>

<template>
    <div class="flex flex-col min-h-svh bg-gray-100 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300">
        <shadcn-sidebar-provider
            variant="inset"
            collapsible="icon"
            name="sidebar-left"
        >
            <shadcn-sidebar>
                <shadcn-sidebar-header class="py-12 text-2xl font-['Petit_Formal_Script'] text-center font-bold"> TennisHistory </shadcn-sidebar-header>
                <shadcn-sidebar-content
                    id="sidebar-content"
                    class="scrollbar scrollbar-thumb-emerald-600 scrollbar-track-transparent pt-5"
                >
                    <shadcn-sidebar-group>
                        <shadcn-sidebar-group-label>Navigation</shadcn-sidebar-group-label>
                        <shadcn-sidebar-group-content>
                            <shadcn-sidebar-menu>
                                <shadcn-sidebar-menu-item
                                    v-for="item in menuItems"
                                    :key="item.label"
                                >
                                    <shadcn-sidebar-menu-button as-child>
                                        <nuxt-link
                                            class="hover-link flex items-center gap-1"
                                            :to="item.to"
                                            active-class="text-emerald-600"
                                        >
                                            <Icon :name="item.icon" />
                                            <span>{{ item.label }}</span>
                                        </nuxt-link>
                                    </shadcn-sidebar-menu-button>
                                </shadcn-sidebar-menu-item>
                            </shadcn-sidebar-menu>
                        </shadcn-sidebar-group-content>
                    </shadcn-sidebar-group>
                    <shadcn-sidebar-group>
                        <shadcn-sidebar-group-label>Related pages</shadcn-sidebar-group-label>
                        <shadcn-sidebar-group-content>
                            <shadcn-sidebar-menu>
                                <shadcn-sidebar-menu-item
                                    v-for="link in footerLinks"
                                    :key="link.name"
                                >
                                    <shadcn-sidebar-menu-button as-child>
                                        <nuxt-link
                                            class="hover-link"
                                            :to="link.url"
                                            target="_blank"
                                            >{{ link.name }}</nuxt-link
                                        >
                                    </shadcn-sidebar-menu-button>
                                </shadcn-sidebar-menu-item>
                            </shadcn-sidebar-menu>
                        </shadcn-sidebar-group-content>
                    </shadcn-sidebar-group>
                </shadcn-sidebar-content>
                <shadcn-sidebar-footer class="text-center pb-5 px-3 text-sm dark:text-zinc-400">
                    Built by
                    <nuxt-link
                        class="hover-link text-emerald-600"
                        to="https://www.claire-sheridan.com"
                        target="_blank"
                    >
                        Claire Sheridan
                    </nuxt-link>
                    using Nuxt, PrimeVue, Shadcn Vue and TailwindCSS
                </shadcn-sidebar-footer>
            </shadcn-sidebar>
            <shadcn-sidebar-inset>
                <shadcn-sidebar-trigger class="absolute py-10" />
                <div class="flex min-h-full">
                    <div class="py-24 w-11/12 md:w-3/4 mx-auto md:ml-16">
                        <slot />
                        <prime-scroll-top />
                    </div>
                    <ClientOnly>
                        <div
                            id="right-sidebar"
                            class="pt-32 pb-10 px-10 mx-auto hidden lg:flex lg:flex-col sticky top-20 h-[40rem]"
                        ></div>
                    </ClientOnly>
                </div>
            </shadcn-sidebar-inset>
        </shadcn-sidebar-provider>
    </div>
</template>
