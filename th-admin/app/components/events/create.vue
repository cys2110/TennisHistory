<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"
import { UFieldGroup } from "#components"

const toast = useToast()
const {
  ui: { icons, colors }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

type Schema = z.output<typeof eventSchema>

const state = reactive<Partial<Schema>>({})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Event ID", key: "id", type: "number", required: true },
  { label: "Tournament", key: "tournament", type: "tournaments", required: true },
  { label: "Year", key: "year", type: "selectMenu", items: ALL_YEARS, required: true },
  { label: "Tours", key: "tours", type: "checkbox", items: tours, required: true },
  { label: "Surface", key: "surface", type: "select", items: surfaces },
  { label: "Venues", key: "venues", type: "venues" },
  { label: "Supervisors", key: "supervisors", type: "supervisors" }
]

const buttonFields: {
  label: string
  children: {
    label: string
    colour: keyof typeof colors
    key?: keyof Schema
    type?: string
    children?: { placeholder: string; key: keyof Schema; type: string; items?: string[] }[]
  }[]
}[] = [
  {
    label: "Links",
    children: [
      { label: "Wiki", colour: "primary", key: "wiki_link", type: "textarea" },
      { label: "ATP", colour: "ATP", key: "atp_link", type: "textarea" },
      { label: "WTA", colour: "WTA", key: "wta_link", type: "textarea" },
      { label: "ITF(M)", colour: "Men", key: "men_link", type: "textarea" },
      { label: "ITF(W)", colour: "Women", key: "women_link", type: "textarea" }
    ]
  },
  {
    label: "Draws",
    children: [
      {
        label: "General",
        colour: "primary",
        children: [
          { key: "draw_type", placeholder: "draw type", type: "select", items: drawOptions },
          { key: "draw_link", placeholder: "draw link", type: "text" }
        ]
      },
      {
        label: "ATP",
        colour: "ATP",
        children: [
          { key: "atp_draw_s", placeholder: "singles draw", type: "select", items: drawOptions },
          { key: "atp_draw_s_link", placeholder: "singles draw link", type: "text" },
          { key: "atp_draw_d", placeholder: "doubles draw", type: "select", items: drawOptions },
          { key: "atp_draw_d_link", placeholder: "doubles draw link", type: "text" },
          { key: "atp_draw_qs", placeholder: "qualifying singles draw", type: "select", items: drawOptions },
          { key: "atp_draw_qs_link", placeholder: "qualifying singles draw link", type: "text" },
          { key: "atp_draw_qd", placeholder: "qualifying doubles draw", type: "select", items: drawOptions },
          { key: "atp_draw_qd_link", placeholder: "qualifying doubles draw link", type: "text" }
        ]
      },
      {
        label: "WTA",
        colour: "WTA",
        children: [
          { key: "wta_draw_s", placeholder: "singles draw", type: "select", items: drawOptions },
          { key: "wta_draw_s_link", placeholder: "singles draw link", type: "text" },
          { key: "wta_draw_d", placeholder: "doubles draw", type: "select", items: drawOptions },
          { key: "wta_draw_d_link", placeholder: "doubles draw link", type: "text" },
          { key: "wta_draw_qs", placeholder: "qualifying singles draw", type: "select", items: drawOptions },
          { key: "wta_draw_qs_link", placeholder: "qualifying singles draw link", type: "text" },
          { key: "wta_draw_qd", placeholder: "qualifying doubles draw", type: "select", items: drawOptions },
          { key: "wta_draw_qd_link", placeholder: "qualifying doubles draw link", type: "text" }
        ]
      },
      {
        label: "ITF(M)",
        colour: "Men",
        children: [
          { key: "men_draw_s", placeholder: "singles draw", type: "select", items: drawOptions },
          { key: "men_draw_s_link", placeholder: "singles draw link", type: "text" },
          { key: "men_draw_d", placeholder: "doubles draw", type: "select", items: drawOptions },
          { key: "men_draw_d_link", placeholder: "doubles draw link", type: "text" },
          { key: "men_draw_qs", placeholder: "qualifying singles draw", type: "select", items: drawOptions },
          { key: "men_draw_qs_link", placeholder: "qualifying singles draw link", type: "text" },
          { key: "men_draw_qd", placeholder: "qualifying doubles draw", type: "select", items: drawOptions },
          { key: "men_draw_qd_link", placeholder: "qualifying doubles draw link", type: "text" }
        ]
      },
      {
        label: "ITF(W)",
        colour: "Women",
        children: [
          { key: "women_draw_s", placeholder: "singles draw", type: "select", items: drawOptions },
          { key: "women_draw_s_link", placeholder: "singles draw link", type: "text" },
          { key: "women_draw_d", placeholder: "doubles draw", type: "select", items: drawOptions },
          { key: "women_draw_d_link", placeholder: "doubles draw link", type: "text" },
          { key: "women_draw_qs", placeholder: "qualifying singles draw", type: "select", items: drawOptions },
          { key: "women_draw_qs_link", placeholder: "qualifying singles draw link", type: "text" },
          { key: "women_draw_qd", placeholder: "qualifying doubles draw", type: "select", items: drawOptions },
          { key: "women_draw_qd_link", placeholder: "qualifying doubles draw link", type: "text" }
        ]
      }
    ]
  }
]

const groupFields: {
  label: string
  colSpan: number
  gridCols: number
  children: {
    label: string
    colour: keyof typeof colors
    key?: keyof Schema
    type?: string
    items?: string[]
    children?: { placeholder: string; key: keyof Schema; type: string }[]
  }[]
}[] = [
  {
    label: "Sponsor Names",
    colSpan: 2,
    gridCols: 3,
    children: [
      { label: "General", colour: "primary", key: "sponsor_name", type: "text" },
      { label: "ATP", colour: "ATP", key: "atp_sponsor_name", type: "text" },
      { label: "WTA", colour: "WTA", key: "wta_sponsor_name", type: "text" }
    ]
  },
  {
    label: "Categories",
    colSpan: 3,
    gridCols: 5,
    children: [
      { label: "General", colour: "primary", key: "category", type: "text" },
      { label: "ATP", colour: "ATP", key: "atp_category", type: "text" },
      { label: "WTA", colour: "WTA", key: "wta_category", type: "text" },
      { label: "ITF(M)", colour: "Men", key: "men_category", type: "text" },
      { label: "ITF(W)", colour: "Women", key: "women_category", type: "text" }
    ]
  },
  {
    label: "Dates",
    colSpan: 3,
    gridCols: 5,
    children: [
      {
        label: "General",
        colour: "primary",
        children: [
          { key: "start_date", placeholder: "start date", type: "date" },
          { key: "end_date", placeholder: "end date", type: "date" }
        ]
      },
      {
        label: "ATP",
        colour: "ATP",
        children: [
          { key: "atp_start_date", placeholder: "start date", type: "date" },
          { key: "atp_end_date", placeholder: "end date", type: "date" }
        ]
      },
      {
        label: "WTA",
        colour: "WTA",
        children: [
          { key: "wta_start_date", placeholder: "start date", type: "date" },
          { key: "wta_end_date", placeholder: "end date", type: "date" }
        ]
      },
      {
        label: "ITF(M)",
        colour: "Men",
        children: [
          { key: "men_start_date", placeholder: "start date", type: "date" },
          { key: "men_end_date", placeholder: "end date", type: "date" }
        ]
      },
      {
        label: "ITF(W)",
        colour: "Women",
        children: [
          { key: "women_start_date", placeholder: "start date", type: "date" },
          { key: "women_end_date", placeholder: "end date", type: "date" }
        ]
      }
    ]
  },
  {
    label: "Money",
    colSpan: 3,
    gridCols: 5,
    children: [
      {
        label: "General",
        colour: "primary",
        key: "currency",
        type: "select",
        items: currencies,
        children: [
          { key: "pm", placeholder: "PM", type: "currency" },
          { key: "tfc", placeholder: "TFC", type: "currency" }
        ]
      },
      {
        label: "ATP",
        colour: "ATP",
        key: "atp_currency",
        type: "select",
        items: currencies,
        children: [
          { key: "atp_pm", placeholder: "PM", type: "currency" },
          { key: "atp_tfc", placeholder: "TFC", type: "currency" }
        ]
      },
      {
        label: "WTA",
        colour: "WTA",
        key: "wta_currency",
        type: "select",
        items: currencies,
        children: [
          { key: "wta_pm", placeholder: "PM", type: "currency" },
          { key: "wta_tfc", placeholder: "TFC", type: "currency" }
        ]
      },
      {
        label: "ITF(M)",
        colour: "Men",
        key: "men_currency",
        type: "select",
        items: currencies,
        children: [{ key: "men_pm", placeholder: "PM", type: "currency" }]
      },
      {
        label: "ITF(W)",
        colour: "Women",
        key: "women_currency",
        type: "select",
        items: currencies,
        children: [{ key: "women_pm", placeholder: "PM", type: "currency" }]
      }
    ]
  }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/events/create", {
      query: event.data
    })
    toast.add({
      title: "Event created",
      icon: icons.success,
      color: "success"
    })
    set(open, false)

    await navigateTo({
      name: "rounds",
      params: { id: state.id }
    })
  } catch (e) {
    toast.add({
      title: "Error creating event",
      description: (e as Error).message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-modal
    title="Create Event"
    v-model:open="open"
    fullscreen
    :ui="{ body: '*:my-2', footer: 'justify-end' }"
  >
    <u-button
      label="Create Event"
      :icon="icons.plus"
    />

    <template #body>
      <u-form
        id="event-form"
        :schema="eventSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-3 gap-2 items-center">
          <form-field
            v-for="field in formFields"
            :key="field.label"
            :field="field"
            v-model="state[field.key]"
          />

          <div
            v-for="field in groupFields"
            :key="field.label"
            :class="`col-span-${field.colSpan}`"
          >
            <u-form-field :label="field.label">
              <div :class="`grid grid-cols-${field.gridCols} gap-2`">
                <u-field-group
                  v-for="item in field.children"
                  :key="item.key"
                >
                  <u-button
                    disabled
                    :color="item.colour"
                    :label="item.label"
                    class="disabled:cursor-default"
                  />
                  <u-input
                    v-if="item.type === 'text'"
                    :id="item.key"
                    v-model="(state[item.key as keyof Schema] as string)"
                    :placeholder="`Enter ${field.label.toLowerCase()}`"
                  >
                    <template
                      v-if="(state[item.key as keyof Schema] as string)?.length"
                      #trailing
                    >
                      <u-button
                        color="neutral"
                        variant="link"
                        size="xs"
                        :icon="icons.close"
                        aria-label="Clear input"
                        @click="state[item.key as keyof Schema] = undefined"
                      />
                    </template>
                  </u-input>

                  <u-select
                    v-else-if="item.type === 'select'"
                    v-model="(state[item.key as keyof Schema] as string)"
                    :items="item.items || []"
                    placeholder="e.g. $"
                    class="w-fit"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state[item.key as keyof Schema] = undefined"
                        size="xs"
                        label="Clear"
                        :icon="icons.close"
                        block
                      />
                    </template>
                  </u-select>

                  <template
                    v-for="child in item.children"
                    :key="child.key"
                  >
                    <date-picker
                      v-if="child.type === 'date'"
                      v-model="state[child.key]"
                      :placeholder="child.placeholder"
                    />

                    <u-input-number
                      v-else-if="child.type === 'currency'"
                      :id="child.key"
                      v-model="(state[child.key] as number)"
                      :placeholder="child.placeholder"
                      :format-options="{
                      style: 'currency',
                      currency: (state[item.key as keyof Schema] as string) || 'USD'
                    }"
                    >
                      <template #increment>
                        <u-button
                          v-if="state[child.key] !== undefined"
                          color="neutral"
                          variant="ghost"
                          size="xs"
                          :icon="icons.close"
                          aria-label="Clear input"
                          @click="state[child.key] = undefined"
                        />
                        <template v-else>{{ "" }}</template>
                      </template>
                    </u-input-number>
                  </template>
                </u-field-group>
              </div>
            </u-form-field>
          </div>

          <div
            v-for="field in buttonFields"
            :key="field.label"
            class="col-span-3"
          >
            <u-form-field :label="field.label">
              <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                <div
                  v-for="item in field.children"
                  :key="item.key"
                >
                  <u-badge
                    :color="item.colour"
                    :label="item.label"
                    size="md"
                    class="w-full justify-center"
                  />
                  <u-textarea
                    v-if="item.type === 'textarea'"
                    :id="item.key"
                    v-model="(state[item.key as keyof Schema] as string)"
                    placeholder="Enter link"
                  >
                    <template
                      v-if="(state[item.key as keyof Schema] as string)?.length"
                      #trailing
                    >
                      <u-button
                        color="neutral"
                        variant="link"
                        size="xs"
                        :icon="icons.close"
                        aria-label="Clear input"
                        @click="state[item.key as keyof Schema] = undefined"
                      />
                    </template>
                  </u-textarea>

                  <template
                    v-for="child in item.children"
                    :key="child.key"
                  >
                    <u-textarea
                      v-if="child.type === 'text'"
                      :id="child.key"
                      v-model="(state[child.key] as string)"
                      :placeholder="`Enter ${child.placeholder}`"
                    >
                      <template
                        v-if="(state[child.key] as string)?.length"
                        #trailing
                      >
                        <u-button
                          color="neutral"
                          variant="link"
                          size="xs"
                          :icon="icons.close"
                          aria-label="Clear input"
                          @click="state[child.key] = undefined"
                        />
                      </template>
                    </u-textarea>

                    <u-select
                      v-else
                      v-model="(state[child.key] as string)"
                      :items="child.items || []"
                      :placeholder="`Select ${child.placeholder}`"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state[child.key] = undefined"
                          size="xs"
                          label="Clear"
                          :icon="icons.close"
                          block
                        />
                      </template>
                    </u-select>
                  </template>
                </div>
              </div>
            </u-form-field>
          </div>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="event-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.check"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
      />
    </template>
  </u-modal>
</template>
