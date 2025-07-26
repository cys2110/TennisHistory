<script setup lang="ts">
useHead({ title: "Supervisors" })
const { viewMode } = useViewMode()
const { itemsPerPage } = useDefaultItems()
const { icons } = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")

const selectedLetter = ref<string | undefined>()
const skip = ref(itemsPerPage.value)
</script>

<template>
  <page-wrapper>
    <template
      #nav-right
      v-if="viewMode !== 'list' || mdAndDown"
    >
      <u-slideover
        v-if="mdAndDown"
        title="Filters"
        class="ml-auto"
      >
        <u-button
          :icon="icons.filter"
          size="xs"
        />
        <template #body>
          <u-form-field label="Items per page">
            <u-slider
              v-model="skip"
              :min="10"
              :max="100"
              :step="10"
              tooltip
              size="sm"
            />
          </u-form-field>

          <filter-letters v-model="selectedLetter" />
        </template>
      </u-slideover>
      <u-form-field
        v-else
        label="Items per page"
        :ui="{ labelWrapper: 'justify-end' }"
      >
        <u-slider
          v-model="skip"
          :min="10"
          :max="100"
          :step="10"
          tooltip
          class="min-w-xs"
        />
      </u-form-field>
    </template>
    <template
      #toolbar
      v-if="!mdAndDown"
    >
      <filter-letters
        v-model="selectedLetter"
        :ui="{ fieldset: 'flex-wrap gap-2' }"
      />
    </template>

    <supervisor-table
      v-if="viewMode === 'list'"
      v-model="selectedLetter"
    />
    <supervisor-grid
      v-else
      v-model="selectedLetter"
      v-model:skip="skip"
    />
  </page-wrapper>
</template>
