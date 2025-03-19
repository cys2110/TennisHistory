<script setup lang="ts">
defineProps<{
  sets: (string | null)[]
  tbs: (string | null)[]
  name: string
  tid: string
  year: string
  eid: string
  mid: string
}>()
</script>

<template>
  <u-link
    class="hover-link"
    :to="{ name: 'match', params: { name: useChangeCase(name, 'kebabCase').value, tid, year, eid, mid } }"
    prefetch-on="interaction"
  >
    <template
      v-for="(set, index) in sets"
      :key="index"
    >
      <!--prettier-ignore-->
      <span v-if="set" class="mr-1">
        {{ set }}<sup v-if="tbs[index]">{{ tbs[index] }}</sup>
      </span>
    </template>
  </u-link>
</template>
