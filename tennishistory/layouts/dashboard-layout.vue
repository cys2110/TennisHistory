<script setup lang="ts">
// Layout for logged in users
const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: NAV_LINKS.flatMap(group => (group.children ? group.children : group))
  }
])
</script>

<template>
  <u-dashboard-group>
    <!--Command palette-->
    <u-dashboard-search :groups />

    <u-dashboard-sidebar collapsible>
      <template #header="{ collapsed }">
        <div
          class="w-full text-center text-lg xl:text-2xl font-cursive"
          :class="{ 'xl:text-xl': collapsed }"
        >
          {{ collapsed ? "TH" : "TennisHistory" }}
        </div>
      </template>
      <template #default="{ collapsed }">
        <u-dashboard-search-button :collapsed />
        <!--Internal links-->
        <u-navigation-menu
          :collapsed
          :items="NAV_LINKS"
          orientation="vertical"
        />
        <!--External links-->
        <u-navigation-menu
          :collapsed
          :items="RELATED_LINKS"
          orientation="vertical"
          class="mt-auto"
        />
      </template>
      <template #footer="{ collapsed }">
        <u-user
          :name="collapsed ? undefined : 'Claire Sheridan'"
          :avatar="{ icon: ICONS.person }"
          :chip="{ color: 'success', position: 'top-right' }"
          size="xl"
        />
      </template>
    </u-dashboard-sidebar>
    <slot />
  </u-dashboard-group>
</template>
