<script setup lang="ts">
const { field } = defineProps<{ field: FormFieldInterface<any>; currency?: string }>()

const modelValue = defineModel<any>()

const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <div :class="`col-span-${field.colSpan ?? 1}`">
    <u-form-field
      :label="field.label"
      :required="field.required"
      :name="field.key?.toString()"
    >
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

      <!-- <u-select-menu
        v-else-if="field.type === 'selectMenu'"
        v-model="modelValue"
        :items="field.items"
        :placeholder="`Select ${field.label.toLowerCase()}`"
        :loading="field.loading"
        value-key="id"
        label-key="label"
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
      </u-select-menu> -->

      <u-input
        v-else-if="field.type === 'text'"
        :type="field.subType || 'text'"
        v-model="modelValue"
        :placeholder="`Enter ${field.label.toLowerCase()}`"
      >
        <template
          v-if="modelValue || modelValue?.length"
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

      <!-- <u-input-tags
        v-else-if="field.type === 'tags'"
        v-model="modelValue"
        :placeholder="`Enter ${field.label.toLowerCase()}`"
        :max="field.max"
        :convert-value="field.format"
      /> -->

      <!-- <input-number
        v-else-if="field.type === 'number'"
        v-model="modelValue"
        :label="field.label"
      /> -->

      <!-- <u-input-number
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
      </u-input-number> -->

      <u-textarea
        v-else-if="field.type === 'textarea'"
        v-model="modelValue"
        :placeholder="`Enter ${field.label.toLowerCase()}`"
      >
        <template #trailing>
          <u-button
            v-if="modelValue?.length"
            color="neutral"
            variant="ghost"
            size="xs"
            :icon="icons.close"
            aria-label="Clear input"
            @click="modelValue = undefined"
          />
        </template>
      </u-textarea>

      <!-- <date-picker
        v-else-if="field.type === 'date'"
        v-model="modelValue"
        :placeholder="field.label.toLowerCase()"
      /> -->

      <u-checkbox-group
        v-else-if="field.type === 'checkbox'"
        v-model="modelValue"
        :items="field.items"
        orientation="horizontal"
        :size="field.size || 'sm'"
      />

      <!-- <u-radio-group
        v-else-if="field.type === 'radio'"
        v-model="modelValue"
        :items="field.items"
        orientation="horizontal"
        :size="field.size || 'sm'"
      />-->

      <form-select-search
        v-else-if="field.type === 'search'"
        :type="field.subType!"
        v-model="modelValue"
        :placeholder="`Select ${field.label.toLowerCase()}`"
        :key="field.key"
        block
      />
    </u-form-field>
  </div>
</template>
