<script setup lang="ts">
const { viewMode } = useDefaults()
useHead({ title: "Categories" })
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1024 })
const mdAndDown = breakpoints.smallerOrEqual("md")

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Categories",
  description: "A collection of categories of tennis tournaments"
}))

// API call
const { data: categories, status } = await useFetch<CategoryType[]>("/api/categories", {
  key: "categories",
  default: () => []
})

// TOC
const toc = computed(() => [
  {
    id: "categories",
    items: categories.value.map(category => ({
      label: category,
      to: `#${category}`
    }))
  }
])

const getCardColour = (category: CategoryType): "wta" | "atp" | "men" | "women" | "joint" => {
  if (category.includes("ITF M") || ["Davis Cup"].includes(category)) {
    return "men"
  } else if (category.includes("ITF W")) {
    return "women"
  } else if (ATP_CATEGORIES.includes(category)) {
    return "atp"
  } else if (WTA_CATEGORIES.includes(category)) {
    return "wta"
  } else {
    return "joint"
  }
}

const getBadge = (category: CategoryType): { text: string; color: "challenger" | "tour" } => {
  if (ATP_CHALLENGER_CATEGORIES.includes(category) || WTA_CHALLENGER_CATEGORIES.includes(category)) {
    return { text: "Challenger", color: "challenger" }
  } else {
    return { text: "Tour", color: "tour" }
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #title>
            <page-title />
          </template>

          <template
            #right
            v-if="viewMode !== 'list'"
          >
            <u-popover>
              <u-button
                :size="mdAndDown ? 'xs' : 'sm'"
                :icon="icons.toc"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search tournaments"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :fuse="{ resultLimit: 1000 }"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <category-table
          v-if="viewMode === 'list'"
          :categories
          :status
        />

        <u-page-grid
          v-else-if="categories.length || status === 'pending'"
          class="xl:grid-cols-4 2xl:grid-cols-5 p-5 scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent overflow-y-auto scroll-smooth"
        >
          <div
            v-if="categories.length"
            v-for="category in categories"
            :key="category"
            :id="category"
          >
            <u-page-card
              :title="category"
              highlight
              :highlight-color="getCardColour(category)"
              :to="{ name: 'category', params: { id: kebabCase(category) } }"
              :ui="{ title: 'text-center', body: 'w-full', description: 'text-center' }"
            >
              <template #description>
                <u-badge
                  v-if="ATP_CATEGORIES.includes(category) || WTA_CATEGORIES.includes(category)"
                  :label="getBadge(category).text"
                  :color="getBadge(category).color"
                />
              </template>
            </u-page-card>
          </div>
          <loading-base
            v-else
            v-for="_ in 10"
            :key="_"
          />
        </u-page-grid>
        <error-message
          v-else
          message="No categories found"
        />
      </template>

      <template
        #footer
        v-if="viewMode !== 'list'"
      >
        <div class="font-semibold p-5 border-t border-muted">Total: {{ categories.length }}</div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
