<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <breadcrumbs />
          </template>

          <template
            #right
            v-if="$slots['nav-right']"
          >
            <slot name="nav-right" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="$slots.toolbar">
          <slot name="toolbar" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <slot />
      </template>
    </u-dashboard-panel>
  </div>
</template>
