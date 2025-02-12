<script setup lang="ts">
defineProps<{ item: { title: string; link: string } }>()
</script>

<template>
  <q-item clickable tag="a" target="_blank" :href="item.link">
    <q-item-section>
      <q-item-label>{{ item.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
