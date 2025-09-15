<script setup lang="ts">
const { icons } = useAppConfig()
const viewType = ref("By Player")
</script>

<template>
  <dashboard-subpanel
    id="entries"
    title="Entries"
    :icon="icons.player"
    class="max-h-200"
  >
    <template #right>
      <u-radio-group
        v-model="viewType"
        :items="['By Player', 'By Team']"
        orientation="horizontal"
      />
    </template>

    <event-entries-players v-if="viewType === 'By Player'" />

    <event-entries-teams v-else />
  </dashboard-subpanel>
</template>
