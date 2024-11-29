<script setup>
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'
import { COLOURS } from './utils/variables';

// [GLOBAL: ADD RESPONSIVE DESIGN]
// [FUTURE: CONVERT TO TYPESCRIPT?]

const tokenColours = { colorPrimary: COLOURS.violet800 }
const componentThemes = {
  Card: { colorBgContainer: COLOURS.violet800 },
  Select: {
    activeBorderColor: COLOURS.violet800,
    hoverBorderColor: COLOURS.violet800,
    colorBorder: COLOURS.violet800,
    colorText: COLOURS.zinc300,
  },
  Anchor: { colorPrimary: COLOURS.violet700 }
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