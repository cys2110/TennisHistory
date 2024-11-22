<script setup>
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'
import Header from './components/Global/Header.vue';
import Footer from './components/Global/Footer.vue';
</script>

<template>
  <a-style-provider hash-priority="low">
    <a-config-provider :theme="{
      algorithm: theme.darkAlgorithm
    }">
      <a-layout class="flex flex-col min-h-screen">
        <a-layout-header class="!bg-violet-800">
          <Header />
        </a-layout-header>
        <a-layout-content class="flex-1 py-16 w-3/4 mx-auto">
          <RouterView :key="$route.fullPath" />
        </a-layout-content>
        <a-layout-footer class="!bg-violet-800">
          <Footer />
        </a-layout-footer>
      </a-layout>
    </a-config-provider>
  </a-style-provider>
</template>