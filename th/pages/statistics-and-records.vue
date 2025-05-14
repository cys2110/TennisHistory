<script setup lang="ts">
useHead({ title: "Statistics and Records", templateParams: { subPage: null } })

// Breadcrumbs
const breadcrumbs = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Statistics and Records", icon: ICONS.stats }
]
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
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-alert
          color="success"
          title="Coming soon!"
          :icon="ICONS.alert"
          class="my-auto"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
