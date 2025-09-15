<script setup lang="ts">
useHead({ title: "About" })
const {
  ui: { icons, colors }
} = useAppConfig()

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About"
}))

const badges: [keyof typeof colors, string][] = [
  ["atp", "ATP"],
  ["wta", "WTA"],
  ["men", "ITF (M)"],
  ["women", "ITF (W)"],
  ["primary", "Joint tours"],
  ["active", "Active"],
  ["inactive", "Inactive"],
  ["singles", "Singles"],
  ["doubles", "Doubles"],
  ["tour", "Tour level"],
  ["challenger", "Challenger level"],
  ["itf", "ITF level"],
  ["main", "Main draw"],
  ["qualifying", "Qualifying draw"]
]
</script>

<template>
  <div classs="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="text-muted text-xl">
            DISCLAIMER: This website is not intended to infringe on any copyright. It is not intended for any monetary or any other disallowed
            purpose.
          </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-container>
          <div>
            This website displays data about Open Era men's and women's tennis in a user-friendly format. The goal is to include data going back to
            1968, but given the volume of the data, please be patient. New features will be introduced as often as possible. Suggestions are welcome!
          </div>
          <div class="my-5">
            I have tried to gather data from the most reliable sources, including the official ATP and WTA websites. However, please note that some
            data (particularly relating to players' coaches as well as data relating to older events) may be inaccurate or incomplete - please let me
            know if you find any issues. Moreover, players' win-loss index and stats and head to head stats are based solely on their singles matches
            as, even where available, stats for doubles matches often do not break out the individual players' stats. All stats are drawn from matches
            where stats are available online.
          </div>
          <div class="my-5"> You can toggle between light and dark mode by clicking the <u-icon :name="icons.search" /> button in the sidebar. </div>
          <div>
            Different categories on the website are colour-coded as follows:
            <div class="flex flex-wrap items-center gap-5 my-5">
              <u-badge
                v-for="badge in badges"
                :key="badge[0]"
                :color="badge[0]"
                :label="badge[1]"
              />
            </div>
          </div>
        </u-container>
      </template>
    </u-dashboard-panel>
  </div>
</template>
