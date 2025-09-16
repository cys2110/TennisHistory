<script setup lang="ts">
useHead({ title: "Categories" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Categories",
  description: "A collection of categories of tennis tournaments"
}))

// API call
const { data: categories, status } = await useFetch<CategoryType[]>("/api/categories", {
  key: "categories",
  default: () => [],
  server: false
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

const getCardColour = (category: CategoryType): "wta" | "atp" | "men" | "women" | "primary" => {
  if (ITF_MEN_CATEGORIES.includes(category)) {
    return "men"
  } else if (ITF_WOMEN_CATEGORIES.includes(category)) {
    return "women"
  } else if (ATP_CATEGORIES.includes(category)) {
    return "atp"
  } else if (WTA_CATEGORIES.includes(category)) {
    return "wta"
  } else {
    return "primary"
  }
}

const getBadge = (category: CategoryType) => {
  if (ATP_CHALLENGER_CATEGORIES.includes(category) || WTA_CHALLENGER_CATEGORIES.includes(category)) {
    return "Challenger"
  } else if (ITF_MEN_CATEGORIES.includes(category) || ITF_WOMEN_CATEGORIES.includes(category)) {
    return "ITF"
  } else {
    return "Tour"
  }
}
</script>

<template>
  <u-container class="max-w-(--container-7xl)">
    <u-page>
      <template #right>
        <u-page-aside>
          <div class="font-semibold">{{ categories.length }} categories</div>
          <u-command-palette
            v-if="categories.length"
            placeholder="Search categories"
            :groups="toc"
            :loading="status === 'pending'"
            :fuse="{ resultLimit: 1000 }"
            :ui="{ content: 'max-h-200 2xl:max-h-150' }"
          />
        </u-page-aside>
      </template>

      <u-page-header title="Categories" />

      <u-page-body>
        <u-page-grid v-if="categories.length || ['pending', 'idle'].includes(status)">
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
              :ui="{ root: 'h-full', title: 'text-center', body: 'w-full', description: 'text-center' }"
            >
              <template #description>
                <coloured-badge :label="getBadge(category)" />
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
      </u-page-body>
    </u-page>
  </u-container>
</template>
