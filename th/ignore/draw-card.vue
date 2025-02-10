<script setup lang="ts">
const route = useRoute()
const props = defineProps<{ match: EventDrawMatchType }>()
const { p1, p2, incomplete, winner, mid } = props.match
</script>

<template>
  <div>Component: event/draw-card</div>
</template>
