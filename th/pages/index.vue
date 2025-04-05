<script setup lang="ts">
definePageMeta({ name: "home" })
useHead({ title: "Home", templateParams: { subPage: null } })

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

// Breadcrumbs
const items = [{ label: "Home", icon: ICONS.home }]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>
      <u-page-hero
        title="Tennis History in the Open Era"
        description="Explore the history of men's tennis since 1968"
      />
      <u-page-grid class="2xl:grid-cols-4 2xl:w-3/4 mx-auto">
        <!--TODO: Add in screenshots-->
        <u-page-feature
          v-for="feat in features"
          :key="feat.title"
          :title="feat.title"
          :icon="feat.icon"
          :description="feat.description"
        />
      </u-page-grid>
    </nuxt-layout>
  </div>
</template>
