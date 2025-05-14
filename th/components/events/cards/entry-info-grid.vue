<script setup lang="ts">
const { data, status } = defineProps<{ data: EntryInfoType[]; status: APIStatusType }>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-collapsible
    v-if="data.length"
    v-for="item in data"
    :key="item.label"
  >
    <u-button
      class="group my-2"
      :label="item.label"
      color="neutral"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
      :trailing-icon="appConfig.ui.icons.chevronDown"
    />

    <template #content>
      <div
        v-for="player in item.content"
        class="flex justify-between items-center text-sm gap-5"
      >
        <player-avatar :player />
        <span> {{ player.status && item.label === "Last direct acceptance" ? "P" : "" }}{{ player.rank ?? player.reason }} </span>
      </div>
    </template>
  </u-collapsible>
  <u-collapsible
    v-else-if="['pending', 'idle'].includes(status)"
    v-for="_ in 6"
    :key="_"
  >
    <u-button
      color="neutral"
      block
      :trailing-icon="appConfig.ui.icons.chevronDown"
      size="xs"
    >
      <u-skeleton class="h-7 w-60 rounded-lg" />
    </u-button>
  </u-collapsible>

  <error-message
    v-else
    :icon="ICONS.noChart"
    :message="`No entry information found for ${name} ${route.params.year}`"
  />
</template>
