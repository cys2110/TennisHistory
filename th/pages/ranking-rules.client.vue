<script setup lang="ts">
useHead({ title: "Ranking Rules", templateParams: { subPage: null } })
const appConfig = useAppConfig()

const selection = ref(new Date().getFullYear().toString())

const breadcrumbs = computed(() => [
  { label: "Home", icon: ICONS.home, to: { name: "home" } },
  { label: "Ranking Rules", icon: ICONS.seeds },
  { label: selection.value }
])

// Fetch ranking rules for selected year
const { data: rules } = await useAsyncData(
  `rules-${selection.value}`,
  () => {
    return queryCollection("rules").where("years", "LIKE", `%${selection.value}%`).first()
  },
  { watch: [selection] }
)

// Fetch points for selected year
const { data: points } = await useAsyncData(
  `points-${selection.value}`,
  () => {
    return queryCollection("points").where("years", "LIKE", `%${selection.value}%`).first()
  },
  { watch: [selection] }
)
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>

          <template #right>
            <!--Link to source-->
            <u-button
              to="https://openerarankings.com"
              :trailing-icon="appConfig.ui.icons.external"
            >
              Open Era Rankings
            </u-button>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <all-years-select v-model="selection" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-header>
          <template #title>
            {{ !rules ? "No" : undefined }} Ranking Rules for {{ selection }}
            {{ !rules ? "Available" : undefined }}
          </template>
        </u-page-header>

        <!--Render rules-->
        <ContentRenderer
          v-if="rules"
          :value="rules"
        />

        <!--Render points-->
        <ContentRenderer
          class="-mt-15"
          v-if="points"
          :value="points"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
