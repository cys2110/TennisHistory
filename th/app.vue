<script setup lang="ts">
useHead({ titleTemplate: pageTitle => (pageTitle ? `${pageTitle} | TennisHistory` : "TennisHistory") })

const route = useRoute()
const anchorScroll = useScrollTo()
const showButton = ref(false)

// Show back to top button when page scrolled
const handleScroll = () => {
  showButton.value = window.scrollY > 200
}
onMounted(() => {
  window.addEventListener("scroll", handleScroll)
})
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})

const navLinks = [
  {
    label: "Tournaments",
    icon: ICONS.trophy,
    active: route.path.startsWith("/tournaments"),
    children: [
      { label: "Upcoming Tournaments", to: { name: "upcoming" }, icon: ICONS["calendar-event"] },
      { label: "Results Archive", to: { name: "archive" }, icon: ICONS.calendar },
      { label: "All Tournaments", to: { name: "tournaments" }, icon: ICONS.trophy }
    ]
  },
  { label: "Players", to: { name: "players" }, icon: ICONS.people, active: route.path.startsWith("/players") },
  { label: "Head to Head", to: { name: "h2h" }, icon: ICONS.swords, active: route.path.startsWith("/h2h") },
  { label: "Search", to: { name: "search" }, icon: ICONS.search, active: route.path.startsWith("/search") }
]

const footerColumns = [
  {
    label: "Governing bodies",
    children: [
      { label: "ATP", to: "https://www.atptour.com/en", target: "_blank" },
      { label: "ITF", to: "https://www.itftennis.com/en/", target: "_blank" }
    ]
  },
  {
    label: "Grand Slams",
    children: [
      { label: "Australian Open", to: "https://ausopen.com", target: "_blank" },
      { label: "Roland Garros", to: "https://www.rolandgarros.com/en-us", target: "_blank" },
      { label: "Wimbledon", to: "https://www.wimbledon.com/en_GB/index.html", target: "_blank" },
      { label: "US Open", to: "https://www.usopen.org/index.html", target: "_blank" }
    ]
  },
  {
    label: "Other",
    children: [
      { label: "About", to: "/about" },
      { label: "About me", to: "https://www.claire-sheridan.com", target: "_blank" }
    ]
  }
]
</script>

<template>
  <u-app
    :tooltip="{ delayDuration: 100 }"
    :toaster="{ position: 'top-center' }"
  >
    <!--Header-->
    <u-header
      title="TennisHistory"
      mode="drawer"
      :toggle="{ color: 'neutral', class: 'text-slate-300' }"
    >
      <u-navigation-menu
        :items="navLinks"
        highlight
        content-orientation="vertical"
      />
      <template #right>
        <u-button
          v-if="showButton"
          icon="solar:round-alt-arrow-up-bold-duotone"
          @click="anchorScroll.scroll('#top')"
          variant="link"
          class="ml-auto"
          color="secondary"
          size="xl"
        />
        <!--[Alpha] Customisation not applying-->
        <u-color-mode-button
          color="secondary"
          variant="link"
          class="text-slate-300"
        />
      </template>
      <!--Show menu toggle on smaller screens-->
      <template #content>
        <u-navigation-menu
          :items="navLinks"
          orientation="vertical"
          highlight
        />
      </template>
    </u-header>
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#2dd4bf 0%,#0d9488 50%,#134e4a 100%)" />
    <!--Main-->
    <u-main class="w-11/12 xl:w-4/5 mx-auto">
      <div id="top" />
      <u-modal-provider />
      <nuxt-layout>
        <nuxt-page />
      </nuxt-layout>
    </u-main>
    <!--Footer-->
    <u-footer>
      <u-footer-columns :columns="footerColumns" />
    </u-footer>
  </u-app>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
