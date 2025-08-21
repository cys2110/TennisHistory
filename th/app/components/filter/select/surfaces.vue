<script setup lang="ts">
const {
  ui: { icons: appIcons },
  icons
} = useAppConfig()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const middleSizes = breakpoints.between("md", "xl")
const modelValue = defineModel<SurfaceType[]>()
const environment = defineModel<EnvironmentType[]>("environment")
</script>

<template>
  <u-form-field
    label="Environment"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="environment"
      :items="['Indoor', 'Outdoor']"
      placeholder="Select environment"
      multiple
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="appIcons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="environment = undefined"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select>
  </u-form-field>
  <u-form-field
    label="Surfaces"
    :size="middleSizes ? 'sm' : 'md'"
  >
    <u-select
      v-model="modelValue"
      multiple
      :items="SURFACES"
      :icon="icons.court"
      placeholder="Select surfaces"
    >
      <template #content-bottom>
        <u-button
          :trailing-icon="appIcons.close"
          color="neutral"
          variant="link"
          size="xs"
          @click="modelValue = undefined"
          label="Clear"
          block
          class="border-t rounded-t-none border-muted"
        />
      </template>
    </u-select>
  </u-form-field>
</template>
