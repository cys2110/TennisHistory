<script setup lang="ts">
definePageMeta({ name: "home" })
useHead({ title: "Home", templateParams: { subPage: null } })
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
  <page-wrapper>
    <u-page-section
      title="Tennis History in the Open Era"
      description="Explore the history of men's tennis since 1968"
      :features
    />
    <u-carousel
      class="my-15 max-h-50"
      loop
      auto-scroll
      auto-height
      :items="screenshots"
      v-slot="{ item }"
    >
      <nuxt-img
        :src="item as string"
        class="rounded-lg calc(100vw - 20rem) mx-auto"
      />
    </u-carousel>
  </page-wrapper>
</template>
