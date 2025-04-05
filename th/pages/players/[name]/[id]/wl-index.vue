<script setup lang="ts">
definePageMeta({ name: "wl-index" })
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const toast = useToast()
const checked = ref(mdAndUp.value ? false : true)

const categoryColours = {
  "Match Record": "text-sky-700",
  "Pressure Points": "text-fuchsia-700",
  Environment: "text-violet-700",
  Other: "text-emerald-700",
  Titles: "text-orange-500/70"
}

// API call
const { data: index, status } = await useFetch<WLIndexInterface[]>("/api/wl-index", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div>
    <ClientOnly>
      <nuxt-layout name="player-layout">
        <!--Legend for chart-->
        <template
          #toolbar-left
          v-if="!checked"
        >
          <div
            v-for="(entry, index) in Object.entries(categoryColours)"
            :key="index"
            class="mx-5 flex items-center gap-2"
          >
            <u-icon
              name="zondicons:color-palette"
              :class="entry[1]"
            />
            <div class="text-neutral-600 dark:text-neutral-400 self-center text-xs lg:text-sm">{{ entry[0] }}</div>
          </div>
        </template>
        <template
          #toolbar-right
          v-if="mdAndUp"
        >
          <u-switch
            v-model="checked"
            :checked-icon="ICONS.table"
            :unchecked-icon="ICONS.barChart"
            :label="checked ? 'Table view' : 'Chart view'"
          />
        </template>
        <wl-index-chart
          v-if="index && !checked"
          :index
        />
        <wl-index-table
          v-else-if="index"
          :index
        />
        <error-message
          v-else
          :icon="ICONS.noChart"
          :title="`No win-loss index available for ${name}`"
          :status
        />
      </nuxt-layout>
    </ClientOnly>
  </div>
</template>
