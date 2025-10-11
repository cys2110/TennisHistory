<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<string[]>()
const {
  ui: { icons }
} = useAppConfig()

const { data: umpires, status } = await useFetch<PersonInterface[]>("/api/umpires", {
  key: "umpires",
  default: () => []
})
</script>

<template>
  <u-form-field
    label="Umpires"
    :size="middleSizes ? 'sm' : 'md'"
    class="my-3"
  >
    <u-select-menu
      v-model="modelValue"
      multiple
      :items="umpires"
      label-key="id"
      value-key="id"
      :loading="['idle', 'pending'].includes(status)"
      :icon="ICONS.umpire"
      placeholder="Select umpires"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="icons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="modelValue = []"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select-menu>
  </u-form-field>
</template>
