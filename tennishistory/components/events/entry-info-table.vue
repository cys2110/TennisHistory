<script setup lang="ts">
const { data } = defineProps<{ data: EntryInfoType[] }>()
</script>

<template>
  <u-collapsible
    v-for="item in data"
    :key="item.label"
  >
    <u-button
      class="group my-2"
      :label="item.label"
      color="neutral"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
      :trailing-icon="ICONS['chevron-down']"
    />

    <template #content>
      <div
        v-for="player in item.content"
        class="flex justify-between items-center"
      >
        <player-avatar :player />
        <span>{{ player.status && item.label === "Last direct acceptance" ? "P" : "" }}{{ player.rank ?? player.reason }}</span>
      </div>
    </template>
  </u-collapsible>
</template>
