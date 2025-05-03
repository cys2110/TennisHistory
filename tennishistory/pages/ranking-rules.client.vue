<script setup lang="ts">
useHead({ title: "Ranking Rules", templateParams: { subPage: null } })
const appConfig = useAppConfig()

const selection = ref(new Date().getFullYear().toString())

const breadcrumbs = computed(() => {
  const items = [
    { label: "Home", icon: ICONS.home, to: { name: "home" } },
    { label: "Ranking Rules", icon: ICONS.seeds }
  ]
  if (selection.value) {
    items.push({ label: selection.value })
  }
  return items
})

const { data: rules } = await useAsyncData(
  "rules",
  () => {
    return queryCollection("rules").where("years", "LIKE", `%${selection.value}%`).first()
  },
  { watch: [selection] }
)

const { data: points } = await useAsyncData(
  "points",
  () => {
    return queryCollection("points").where("years", "LIKE", `%${selection.value}%`).first()
  },
  { watch: [selection] }
)
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="breadcrumbs" />
      </template>

      <template #right>
        <u-button
          to="https://openerarankings.com"
          :trailing-icon="appConfig.ui.icons.external"
        >
          Open Era Rankings
        </u-button>
      </template>

      <template #toolbar>
        <all-years-select v-model="selection" />
      </template>

      <u-page-header>
        <template #title>
          {{ !rules ? "No" : undefined }} Ranking Rules for {{ selection }}
          {{ !rules ? "Available" : undefined }}
        </template>
      </u-page-header>

      <ContentRenderer
        v-if="rules"
        :value="rules"
      />

      <ContentRenderer
        class="-mt-15"
        v-if="points"
        :value="points"
      />
    </nuxt-layout>
  </div>
</template>
