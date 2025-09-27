<script setup lang="ts">
const { loading = false, placeholder } = defineProps<{ placeholder: string; options: string[]; loading?: boolean }>()
const {
  ui: { icons }
} = useAppConfig()
const modelValue = defineModel<string[]>()

const iconsMapping: Record<typeof placeholder, string> = {
  Tournament: ICONS.tournament,
  Levels: ICONS.hybrid,
  Categories: ICONS.categories,
  Surfaces: ICONS.court,
  Supervisors: ICONS.supervisor,
  Umpires: ICONS.umpire
}
</script>

<template>
  <u-select-menu
    v-model="modelValue"
    :items="options"
    :icon="iconsMapping[placeholder]"
    multiple
    :placeholder
    :loading
    class="w-fit max-w-50"
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
</template>
