<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

// API call
const { data, status } = await useFetch<EntryInfoType[]>("/api/events/entry-info", {
  query: { eid: route.params.eid },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching entry information for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <dashboard-subpanel
    title="Entry Information"
    :icon="ICONS.treeDiagram"
    :class="checked ? 'w-full' : '!w-fit'"
  >
    <template #right>
      <!--Only allow chart view on medium+ screens-->
      <ClientOnly>
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :label="checked ? 'Chart' : 'Table'"
          :checked-icon="ICONS.treeDiagram"
          :unchecked-icon="ICONS.table"
        />
      </ClientOnly>
    </template>

    <div v-if="data">
      <entry-info-tree
        v-if="checked"
        :data
      />
      <entry-info-collapsible
        v-else
        :data
      />
    </div>

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
      :title="`No entry information found for ${name} ${route.params.year}`"
    />
  </dashboard-subpanel>
</template>
