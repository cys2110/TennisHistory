<script setup lang="ts">
import MenuLink from 'src/components/MenuLink.vue'

interface LinkProps {
  title: string
  link: string
  icon?: string
}

const relatedList: LinkProps[] = [
  {
    title: 'ATP',
    link: 'https://www.atptour.com/',
  },
  {
    title: 'ITF',
    link: 'https://www.itftennis.com/',
  },
  {
    title: 'Australian Open',
    link: 'https://ausopen.com/',
  },
  {
    title: 'Roland Garros',
    link: 'https://www.rolandgarros.com/',
  },
  {
    title: 'Wimbledon',
    link: 'https://www.wimbledon.com/',
  },
  {
    title: 'US Open',
    link: 'https://www.usopen.org/',
  },
]
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Title
        </q-toolbar-title>
        <q-tabs align="left">
          <q-route-tab to="/page1" label="Page One" />
          <q-route-tab to="/page2" label="Page Two" />
          <q-route-tab to="/page3" label="Page Three" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="footer bg-primary text-text-heading q-pb-md">
      <div
        class="justify-evenly text-text-heading q-mx-xl"
        :class="{ row: $q.screen.gt.xs, column: $q.screen.lt.sm }"
      >
        <MenuLink v-for="link in relatedList" :key="link.title" :item="link" />
      </div>
      <div class="text-center">
        Built by
        <router-link
          to="https://www.claire-sheridan.com"
          target="_blank"
          class="text-green-6 no-underline"
          >Claire Sheridan</router-link
        >
        using TypeScript and Quasar
      </div>
    </q-footer>
  </q-layout>
</template>

<!-- <style lang="scss" scoped>
.footer {
  color: var(--q-heading-dark);
}
</style> -->
