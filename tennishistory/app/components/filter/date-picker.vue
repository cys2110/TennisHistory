<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
const dateRange = defineModel<{ start: CalendarDate | undefined; end: CalendarDate | undefined }>("dateRange")
</script>

<template>
  <u-calendar
    v-model="dateRange"
    range
    :fixed-weeks="false"
    size="sm"
  />
</template>
