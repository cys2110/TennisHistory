<script setup lang="ts">
export interface RelatedLinkProps {
  title: string
  link: string
}

withDefaults(defineProps<RelatedLinkProps>(), {
  title: '',
  link: '',
})
</script>

<template>
  <q-item v-ripple clickable tag="a" :href="link" target="_blank" :inset-level="1">
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
