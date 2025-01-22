<script setup lang="ts">
defineProps<{ event: any; name: string; tid: string; year: string; eid: string; match_no: string }>()
</script>

<template>
  <nuxt-link
    class="hover-link"
    :to="{ name: 'match', params: { name: useChangeCase(name, 'kebabCase').value, tid, year, eid, mid: match_no } }"
  >
    <template
      v-for="(_, index) in new Array(5)"
      :key="index"
    >
      <span v-if="event[`s${index + 1}`]">
        {{ event[`s${index + 1}`] }}
        <sup v-if="event[`t${index + 1}`]">
          {{ event[`t${index + 1}`] }}
        </sup>
      </span>
    </template>
  </nuxt-link>
</template>
