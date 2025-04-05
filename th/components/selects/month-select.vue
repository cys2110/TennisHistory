<script setup lang="ts">
const breakpoints = useBreakpoints(breakpointsTailwind)
const md = breakpoints.md
const lgAndUp = breakpoints.greaterOrEqual("lg")
const modelValue = defineModel<(keyof typeof MonthsEnum)[]>()

const shortcuts = {
  January: ["meta", "j"],
  February: ["meta", "f"],
  March: ["meta", "m"],
  April: ["meta", "a"],
  May: ["meta", "shift", "m"],
  June: ["meta", "shift", "j"],
  July: ["meta", "i"],
  August: ["meta", "shift", "a"],
  September: ["meta", "s"],
  October: ["meta", "o"],
  November: ["meta", "n"],
  December: ["meta", "d"]
}
</script>

<template>
  <u-form-field
    label="Months"
    :size="lgAndUp ? 'md' : md ? 'sm' : 'xs'"
  >
    <template
      #hint
      v-if="lgAndUp"
    >
      <u-modal title="Months shortcuts">
        <u-button
          icon="ic:sharp-help"
          variant="link"
          color="neutral"
          size="xs"
          class="cursor-pointer"
        />
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              v-for="([key, value], index) in Object.entries(shortcuts)"
              :key="index"
            >
              {{ key }}:
              <u-kbd
                v-for="v in value"
                :key="v"
                :value="v"
              />
            </div>
          </div>
        </template>
      </u-modal>
    </template>

    <u-select
      v-model="modelValue"
      multiple
      :items="MONTH_NAMES"
      :icon="ICONS.event"
      class="w-full"
      placeholder="Select months"
    />
  </u-form-field>
</template>
