<script setup lang="ts">
const props = defineProps<{ event: EventCardType }>()
const { tname, ename } = props.event
</script>

<template>
  <q-card class="col-3">
    <q-card-section>
      <div>{{ tname }}</div>
      <div v-if="ename">{{ ename }}</div>
      <q-separator inset class="q-my-md" />
    </q-card-section>
  </q-card>
</template>
