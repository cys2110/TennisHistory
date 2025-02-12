<script setup lang="ts">
interface LinkProps {
  title: string
  link: string
  icon?: string
}

const navList: LinkProps[] = [
  {
    title: 'Home',
    icon: 'fa-duotone fa-solid fa-house',
    link: '/',
  },
  {
    title: 'Results Archive',
    icon: 'fa-duotone fa-solid fa-calendars',
    link: '/archive',
  },
  {
    title: 'Head to Head',
    icon: 'fa-duotone fa-solid fa-swords',
    link: '/h2h',
  },
  {
    title: 'Search',
    icon: 'fa-duotone fa-solid fa-magnifying-glass',
    link: '/search',
  },
  {
    title: 'About',
    icon: 'fa-duotone fa-regular fa-circle-info',
    link: '/about',
  },
]

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
  <q-layout view="hHh LpR fFf">
    <q-header reveal elevated class="bg-deep-purple-8 text-blue-grey-3" height-hint="98">
      <q-toolbar class="glossy">
        <q-toolbar-title class="header-font"> TennisHistory </q-toolbar-title>
        <q-btn-dropdown
          icon="fa-duotone fa-solid fa-bars"
          size="sm"
          dropdown-icon="none"
          unelevated
          dense
        >
          <q-list dense>
            <q-item
              v-for="link in navList"
              :key="link.title"
              tag="a"
              clickable
              :to="link.link"
              v-close-popup
            >
              <q-item-section avatar>
                <q-icon :name="link.icon" size="xs" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">{{ link.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-page-container class="page-wrapper">
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-deep-purple-8 lt-lg text-center q-py-md q-mt-auto">
      <div
        class="justify-evenly q-mb-md"
        :class="{ row: $q.screen.gt.xs, column: $q.screen.lt.sm }"
      >
        <div v-for="link in relatedList" :key="link.title">
          <router-link :to="link.link" target="_blank">
            {{ link.title }}
          </router-link>
        </div>
      </div>
      <div>
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

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Petit+Formal+Script&display=swap');

.header-font {
  font-family: 'Petit Formal Script', serif;
}

.page-wrapper {
  width: 70%;
  margin-left: 8em;
}
</style>
