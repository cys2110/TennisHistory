<script setup lang="ts">
defineProps<{ sets: (string | null)[]; tbs: (string | null)[]; name: string; tid: string; year: string; eid: string; match_no: string }>()
</script>

<template>
  <nuxt-link
    class="hover-link"
    :to="{ name: 'match', params: { name: useChangeCase(name, 'kebabCase').value, tid, year, eid, mid: match_no } }"
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
  </nuxt-link>
</template>
