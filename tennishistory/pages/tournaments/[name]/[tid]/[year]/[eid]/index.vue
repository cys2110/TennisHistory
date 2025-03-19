<script setup lang="ts">
definePageMeta({
  name: "event",
  layout: "dashboard-layout"
})
const checked = ref(false)
</script>

<template>
  <event-wrapper>
    <template #toolbar-right>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS.table"
        :unchecked-icon="ICONS['bar-chart']"
        :label="checked ? 'Table view' : 'Chart view'"
      />
    </template>

    <event-details />

    <div
      class="gap-5"
      :class="checked ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'"
    >
      <awards :checked />
      <seeds :checked />
      <entry-info :checked />
    </div>

    <entries :checked />
  </event-wrapper>
</template>
