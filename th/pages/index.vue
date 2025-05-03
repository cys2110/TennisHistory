<script setup lang="ts">
definePageMeta({ name: "home" })
useHead({ title: "Home", templateParams: { subPage: null } })

// Breadcrumbs
const items = [{ label: "Home", icon: ICONS.home }]

// Features
const features = [
  {
    title: "Results",
    icon: ICONS.event,
    description: "Explore tournament results starting from the Open Era"
  },
  {
    title: "Players",
    icon: ICONS.people,
    description: "Discover player profiles and activity"
  },
  {
    title: "Head to Head",
    icon: ICONS.h2h,
    description: "Examine match ups between players"
  },
  {
    title: "Statistics and Records",
    icon: ICONS.stats,
    description: "Charge up your tennis trivia with fun facts and figures"
  }
]

// Screenshots
const screenshots = [
  "./pages/archive.png",
  "./pages/player.png",
  "./pages/h2h.png",
  "./pages/tournament.png"
]
</script>

<template>
  <div>
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>
          <template #title>
            <u-breadcrumb :items />
          </template>
        </u-dashboard-navbar>
      </template>
      <template #body>
        <u-page-hero
          title="Tennis History in the Open Era"
          description="Explore the history of men's tennis since 1968"
        />
        <u-page-grid class="2xl:grid-cols-4 2xl:w-3/4 mx-auto">
          <u-page-feature
            v-for="feat in features"
            :key="feat.title"
            :title="feat.title"
            :icon="feat.icon"
            :description="feat.description"
          />
        </u-page-grid>
        <u-carousel
          class="my-15"
          loop
          auto-scroll
          :items="screenshots"
          v-slot="{ item }"
        >
          <nuxt-img
            :src="item as string"
            class="rounded-lg calc(100vw - 20rem) mx-auto"
          />
        </u-carousel>
      </template>
    </u-dashboard-panel>
  </div>
</template>
