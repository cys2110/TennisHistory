<script setup lang="ts">
definePageMeta({ name: "home" })
useHead({ title: "Home" })
const { icons } = useAppConfig()

// Features
const features = [
  {
    title: "Results",
    icon: icons.event,
    description: "Explore tournament results starting from the Open Era"
  },
  {
    title: "Head to Head",
    icon: icons.h2h,
    description: "Examine match ups between players"
  },
  {
    title: "Statistics and Records",
    icon: icons.stats,
    description: "Charge up your tennis trivia with fun facts and figures"
  }
]

// Screenshots
const screenshots = ["./pages/archive.png", "./pages/player.png", "./pages/h2h.png", "./pages/tournament.png"]
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-section
          title="Tennis History in the Open Era"
          description="Explore tennis since 1968"
          :features
        />
        <div class="relative w-full h-[400px] overflow-hidden">
          <u-marquee
            reverse
            orientation="vertical"
            :overlay="false"
            :ui="{
              root: '[--duration:40s] absolute w-[460px] -left-[100px] -top-[300px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30'
            }"
          >
            <nuxt-img
              v-for="screenshot in screenshots"
              :key="screenshot"
              :src="screenshot"
              width="460"
              height="258"
              class="aspect-video border border-default rounded-lg bg-white"
            />
          </u-marquee>
          <u-marquee
            orientation="vertical"
            :overlay="false"
            :ui="{
              root: '[--duration:40s] absolute w-[460px] -top-[400px] left-[480px] h-[1160px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30'
            }"
          >
            <nuxt-img
              v-for="screenshot in screenshots"
              :key="screenshot"
              :src="screenshot"
              width="460"
              height="258"
              class="aspect-video border border-default rounded-lg bg-white"
            />
          </u-marquee>
          <u-marquee
            reverse
            orientation="vertical"
            :overlay="false"
            :ui="{
              root: 'hidden md:flex [--duration:40s] absolute w-[460px] -top-[300px] left-[1020px] h-[1060px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30'
            }"
          >
            <nuxt-img
              v-for="screenshot in screenshots"
              :key="screenshot"
              :src="screenshot"
              width="460"
              height="258"
              class="aspect-video border border-default rounded-lg bg-white"
            />
          </u-marquee>
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
