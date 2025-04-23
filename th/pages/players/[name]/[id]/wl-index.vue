<script setup lang="ts">
definePageMeta({ name: "wl-index" })
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const route = useRoute()
const toast = useToast()

const checked = ref(false)

const categoryColours = {
  "Match Record": "text-sky-700",
  "Pressure Points": "text-fuchsia-700",
  Environment: "text-violet-700",
  Other: "text-emerald-700",
  Titles: "text-orange-500/70"
}

// API call
const {
  data: index,
  status,
  refresh
} = await useFetch<WLIndexInterface[]>("/api/wl-index", {
  query: { id },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching win-loss index for ${name.value}`,
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

watch(
  () => id.value,
  newId => {
    if (newId && newId !== " " && route.name === "wl-index") refresh()
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <!--Legend for chart-->
      <template #toolbar>
        <div
          v-if="checked && mdAndUp"
          v-for="(entry, index) in Object.entries(categoryColours)"
          :key="index"
          class="mx-5 flex items-center gap-2"
        >
          <u-icon
            name="zondicons:color-palette"
            :class="entry[1]"
          />
          <div class="text-(--ui-text-muted) self-center text-xs lg:text-sm">{{ entry[0] }}</div>
        </div>

        <!--Only show chart if medium+ screens-->
        <u-switch
          v-if="mdAndUp"
          v-model="checked"
          :checked-icon="ICONS.barChart"
          :unchecked-icon="ICONS.table"
          :label="checked ? 'Chart' : 'Table'"
          class="ml-auto"
        />
      </template>
      <div v-if="index || ['pending', 'idle'].includes(status)">
        <wl-index-chart
          v-if="checked && mdAndUp && index"
          :index
        />
        <wl-index-table
          v-else
          :index
          :status
        />
      </div>
      <error-message
        v-else
        :icon="ICONS.noChart"
        :title="`No win-loss index available for ${name}`"
        :status="status"
        :error="`${name}'s win-loss index`"
      />
    </nuxt-layout>
  </div>
</template>
