<script setup lang="ts">
useHead({ title: "About", templateParams: { subPage: null } })
const appConfig = useAppConfig()

const breadcrumbs = [
  { label: "Home", icon: ICONS.home, to: { name: "home" } },
  { label: "About", icon: appConfig.ui.icons.info }
]
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel :ui="{ body: 'xl:w-1/2 mx-auto' }">
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="text-(--ui-text-muted) text-xl">
            DISCLAIMER: This website is not intended to infringe on any copyright. It is not
            intended for any monetary or any other disallowed purpose.
          </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <div>
          This website displays data about Open Era men's singles tennis in a user-friendly format.
          The goal is to include data going back to 1968 as well as Davis Cup data. At some point in
          the future, I may include women's tennis or men's doubles or tournaments lower than the
          ATP Tour, but for now no expansion is planned on the data. Instead new features will be
          introduced as often as possible. Suggestions are welcome!
        </div>

        <div>
          You can toggle between light and dark mode as well as between list and card view by
          clicking the shortcuts button at the top of the sidebar or by pressing the
          <u-kbd value="meta" /><u-kbd value="k" /> keys. Card view provides a more aesthetic view
          of the data but list view provides a quicker overview.
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
