<script setup>
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'

// [GLOBAL: CLEAN UP CODE (.MAP, REMOVE CONSOLE.LOGS, DOCUMENT TITLES, WATCH IMMEDIATE, ADD COMMENTS, USE COLOUR VARIABLES, URL QUERIES, PAGE LAYOUTS, UPDATEDOCUMENTTITLE UTIL, ENCODE ANCHOR LINKS, ORDER OF IMPORTS, ETC)]
// [GLOBAL: ADD RESPONSIVE DESIGN]
// [FUTURE: CONVERT TO TYPESCRIPT?]

const tokenColours = { colorPrimary: "#5b21b6" }
const componentThemes = {
  Card: { colorBgContainer: "#5b21b6" },
  Select: {
    activeBorderColor: "#5b21b6",
    hoverBorderColor: "#5b21b6",
    colorBorder: "#5b21b6",
    colorText: "#d4d4d8",
  },
  Anchor: { colorPrimary: '#6d28d9' }
}
</script>

<template>
  <a-style-provider hash-priority="low">
    <a-config-provider :theme="{
      algorithm: theme.darkAlgorithm,
      token: tokenColours,
      components: componentThemes
    }">
      <a-layout class="flex flex-col min-h-screen">
        <a-layout-header class="!bg-violet-800 sticky top-0 z-50 w-full flex items-center">
          <Header class="" />
        </a-layout-header>
        <a-layout-content class="flex-1 py-16 w-3/4 mx-auto font">
          <RouterView :key="$route.fullPath" />
          <a-back-top type="primary" />
        </a-layout-content>
        <a-layout-footer class="!bg-violet-800">
          <Footer />
        </a-layout-footer>
      </a-layout>
    </a-config-provider>
  </a-style-provider>
</template>

<style>
.font,
div {
  font-family: 'Fira Sans', sans-serif
}
</style>