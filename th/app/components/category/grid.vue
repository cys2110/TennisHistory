<script setup lang="ts">
const { categories, status } = defineProps<{
  categories: CategoryType[]
  status: APIStatusType
}>()

const getCardColor = (category: CategoryType) => {
  if (["United Cup", "Grand Slam", "Olympics"].includes(category)) return "joint"
  if (ATP_CATEGORIES.includes(category)) {
    return "atp"
  } else if (WTA_CATEGORIES.includes(category)) {
    return "wta"
  } else if (ITF_MEN_CATEGORIES.includes(category)) {
    return "men"
  } else {
    return "women"
  }
}

const getTour = (category: CategoryType) => {
  if (ATP_CATEGORIES.includes(category)) {
    return "ATP"
  } else if (WTA_CATEGORIES.includes(category)) {
    return "WTA"
  } else if (ITF_MEN_CATEGORIES.includes(category)) {
    return "ITF (M)"
  } else {
    return "ITF (W)"
  }
}
</script>

<template>
  <u-page-grid
    v-if="categories.length || status === 'pending'"
    class="xl:grid-cols-4 2xl:grid-cols-5 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent gap-3 scroll-smooth"
  >
    <div
      v-if="categories.length"
      class="h-full"
      v-for="category in categories"
      :key="category"
    >
      <u-link
        :to="{ name: 'category', params: { id: kebabCase(category) } }"
        class="hover:text-muted"
      >
        <u-card
          :ui="{
            root: `ring-${getCardColor(category)} h-full`,
            header: 'flex items-center justify-between',
            body: 'text-center font-semibold'
          }"
        >
          <template #header>
            <div
              v-if="['United Cup', 'Grand Slam'].includes(category)"
              class="flex items-center gap-2"
            >
              <u-badge
                color="atp"
                label="ATP"
              />
              <u-badge
                color="wta"
                label="WTA"
              />
            </div>
            <u-badge
              v-else
              :color="getCardColor(category)"
              :label="category === 'Olympics' ? 'ITF' : getTour(category)"
            />
            <u-badge
              :color="ATP_CHALLENGER_CATEGORIES.includes(category) || WTA_CHALLENGER_CATEGORIES.includes(category) ? 'challenger' : 'tour'"
              :label="ATP_CHALLENGER_CATEGORIES.includes(category) || WTA_CHALLENGER_CATEGORIES.includes(category) ? 'Challenger' : 'Tour'"
            />
          </template>
          {{ category }}
        </u-card>
      </u-link>
    </div>
    <loading-base
      v-else
      v-for="_ in 8"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    message="No categories found"
  />
</template>
