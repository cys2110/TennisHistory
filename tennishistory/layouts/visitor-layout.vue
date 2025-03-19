<template>
  <!--Layout for unauthenticated users-->
  <u-page>
    <!--Header-->
    <u-header title="TennisHistory">
      <!--Nav menu for larger screens-->
      <u-navigation-menu
        :items="NAV_LINKS"
        content-orientation="vertical" />

      <template #right>
        <u-color-mode-button
          color="secondary"
          variant="link" />
      </template>

      <!--Nav menu for smaller screens-->
      <template #content>
        <u-navigation-menu
          :items="NAV_LINKS"
          orientation="vertical" />
      </template>
    </u-header>

    <!--Page content-->
    <u-main>
      <slot />
    </u-main>

    <!--Footer-->
    <u-footer>
      <u-footer-columns :columns="RELATED_LINKS" />
    </u-footer>
  </u-page>
</template>
