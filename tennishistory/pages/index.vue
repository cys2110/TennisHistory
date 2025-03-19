<script setup lang="ts">
definePageMeta({
  name: "home",
  layout: "visitor-layout"
})
useHead({
  title: "Home",
  templateParams: { subPage: null }
})

const features = [
  {
    title: "Results",
    icon: ICONS.calendar,
    description: "Explore tournament results starting from the Open Era"
  },
  {
    title: "Players",
    icon: ICONS.people,
    description: "Discover player profiles and activity"
  },
  {
    title: "Head to Head",
    icon: ICONS.swords,
    description: "Examine match ups between players"
  },
  {
    title: "Statistics and Records",
    icon: ICONS["line-scatter"],
    description: "Charge up your tennis trivia with fun facts and figures"
  }
]

const links = [
  { label: "Sign Up", to: { name: "signup" }, icon: "material-symbols:person-raised-hand-outline" },
  { label: "Log In", to: { name: "login" }, icon: "solar:login-3-bold" }
]
</script>

<template>
  <u-page class="lg:w-4/5 mx-auto">
    <u-page-hero
      title="Tennis History in the Open Era"
      description="Explore the history of men's tennis since 1968"
      :links />

    <div class="text-center mb-10">Sign up to gain access to decades of ATP men's singles data and see statistics in beautiful, easy to understand layouts.</div>
    <u-page-grid>
      <!--TODO: Add in screenshots-->
      <u-page-feature
        v-for="feat in features"
        :key="feat.title"
        :title="feat.title"
        :icon="feat.icon"
        :description="feat.description" />
    </u-page-grid>
  </u-page>
</template>
