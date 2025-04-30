<script setup lang="ts">
definePageMeta({ name: "wl-index" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const checked = ref(false)

const categoryColours = {
  "Match Record": "text-sky-700",
  "Pressure Points": "text-fuchsia-700",
  Environment: "text-violet-700",
  Other: "text-emerald-700",
  Titles: "text-orange-500/70"
}

// API call
const { data: index, status } = await useFetch<WLIndexInterface[]>("/api/players/wl-index", {
  query: { id: route.params.id },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching win-loss index for ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <!--Legend for chart-->
      <template #toolbar>
        <ClientOnly>
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
        </ClientOnly>
      </template>

      <div v-if="index || ['pending', 'idle'].includes(status)">
        <ClientOnly>
          <wl-index-chart
            v-if="checked && mdAndUp && index"
            :index
          />
          <wl-index-table
            v-else
            :index
            :status
          />
        </ClientOnly>
      </div>
      <error-message
        v-else
        :icon="ICONS.noChart"
        :title="`No win-loss index available for ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
