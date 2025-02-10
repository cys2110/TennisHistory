<script setup lang="ts">
import { type RelatedLinkProps } from 'src/components/nav/RelatedLink.vue'

const relatedList: RelatedLinkProps[] = [
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
  <q-layout view="hhh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> TennisHistory </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="text-center q-py-md">
      <div class="flex flex-col md:flex-row justify-evenly q-mb-md footer q-mx-auto">
        <div v-for="link in relatedList" :key="link.title">
          <router-link :to="link.link" target="_blank" class="text-blue-grey-1 no-underline">{{
            link.title
          }}</router-link>
        </div>
      </div>
      <div>
        Created by
        <a href="https://www.claire-sheridan.com" target="_blank" class="text-green-6 no-underline"
          >Claire Sheridan</a
        >
        using Vue, Quasar and TypeScript
      </div>
    </q-footer>
  </q-layout>
</template>

<style lang="scss" scoped>
.footer {
  width: 50%;
}
</style>
