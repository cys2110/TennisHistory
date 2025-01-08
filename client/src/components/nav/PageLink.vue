<script setup lang="ts">
import { useRoute } from 'vue-router'
const $route = useRoute()

export interface PageLinkProps {
  title: string
  link: string
}

withDefaults(defineProps<PageLinkProps>(), {
  link: '',
  icon: '',
})
</script>

<template>
  <q-item v-ripple clickable>
    <q-item-label class="text-blue-grey-5 text-body-2 q-my-xs">
      <router-link :to="link" :class="{ 'text-green-7': $route.hash === link }">{{
        title
      }}</router-link>
    </q-item-label>
  </q-item>
</template>
