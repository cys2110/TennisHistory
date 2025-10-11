<script setup lang="ts">
defineProps<{
  field: FormFieldInterface<any>
  currency?: string
}>()

const modelValue = defineModel<any>()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <!--@vue-expect-error-->
  <u-form-field
    :label="field.label"
    :required="field.required"
    :name="field.key"
  >
    <!--@vue-ignore-->
    <u-select
      v-if="field.type === 'select'"
      v-model="modelValue"
      :items="field.items"
      :placeholder="`Select ${field.label.toLowerCase()}`"
    >
      <template #content-bottom>
        <u-button
          label="Clear"
          size="xs"
          @click="modelValue = undefined"
          :icon="icons.close"
          block
        />
      </template>
    </u-select>

    <!--@vue-ignore-->
    <u-select-menu
      v-else-if="field.type === 'selectMenu'"
      v-model="modelValue"
      :items="field.items"
      :placeholder="`Select ${field.label.toLowerCase()}`"
      :loading="field.loading"
    >
      <template #content-bottom>
        <u-button
          label="Clear"
          size="xs"
          @click="modelValue = undefined"
          :icon="icons.close"
          block
        />
      </template>
    </u-select-menu>

    <!--@vue-ignore-->
    <u-input
      v-else-if="field.type === 'text'"
      :type="field.subType || 'text'"
      v-model="modelValue"
      :placeholder="`Enter ${field.label.toLowerCase()}`"
      :disabled="field.disabled"
    >
      <template
        v-if="(modelValue as string)?.length && !field.disabled"
        #trailing
      >
        <u-button
          color="neutral"
          variant="link"
          size="xs"
          :icon="icons.close"
          aria-label="Clear input"
          @click="modelValue = undefined"
        />
      </template>
    </u-input>

    <u-input-tags
      v-else-if="field.type === 'tags'"
      v-model="modelValue"
      :placeholder="`Enter ${field.label.toLowerCase()}`"
      :max="field.max"
      :convert-value="field.format"
    />

    <input-number
      v-else-if="field.type === 'number'"
      v-model="modelValue"
      :label="field.label"
    />

    <u-input-number
      v-else-if="field.type === 'currency'"
      v-model="modelValue"
      :placeholder="`Enter ${field.label.toLowerCase()}`"
      :step="0.01"
      :format-options="{
        style: 'currency',
        currency: currency || 'USD'
      }"
    >
      <template #increment>
        <u-button
          v-if="modelValue !== undefined"
          color="neutral"
          variant="ghost"
          size="xs"
          :icon="icons.close"
          aria-label="Clear input"
          @click="modelValue = undefined"
        />
        <template v-else>{{ "" }}</template>
      </template>
    </u-input-number>

    <date-picker
      v-else-if="field.type === 'date'"
      v-model="modelValue"
      :placeholder="field.label.toLowerCase()"
    />

    <coaches-search
      v-else-if="field.type === 'coaches'"
      :placeholder="field.label.toLowerCase()"
      v-model="modelValue"
    />

    <umpires-search
      v-else-if="field.type === 'umpires'"
      :placeholder="field.label.toLowerCase()"
      v-model="modelValue"
    />

    <supervisors-search
      v-else-if="field.type === 'supervisors'"
      :placeholder="field.label.toLowerCase()"
      v-model="modelValue"
    />

    <venues-search
      v-else-if="field.type === 'venues'"
      :placeholder="field.label.toLowerCase()"
      v-model="modelValue"
    />

    <players-search
      v-else
      :placeholder="field.label.toLowerCase()"
      v-model="modelValue"
    />
  </u-form-field>
</template>
