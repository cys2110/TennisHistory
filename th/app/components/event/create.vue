<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui"

const {
  ui: { icons, colors }
} = useAppConfig()
const toast = useToast()
const open = ref(false)
const uploading = ref(false)

defineShortcuts({
  meta_shift_e: () => set(open, !get(open))
})

const state = reactive<EventSchema>({
  id: 0,
  tournament: {
    id: 0,
    label: "Select Tournament"
  },
  year: new Date().getFullYear(),
  tours: [],
  supervisors: [],
  venues: []
})

const formFields: FormFieldInterface<EventSchema>[] = [
  { label: "ID", key: "id", type: "text", subType: "number", required: true },
  { label: "Tournament", key: "tournament", type: "search", subType: "tournaments", required: true },
  { label: "Year", key: "year", type: "selectMenu", items: ALL_YEARS, required: true },
  { label: "Tours", key: "tours", type: "checkbox", items: TOUR_OPTIONS, required: true },
  { label: "Surface", key: "surface", type: "select", items: SURFACES },
  { label: "Venues", key: "venues", type: "search", subType: "venues", multiple: true },
  { label: "Supervisors", key: "supervisors", type: "search", subType: "supervisors", multiple: true }
]

const groupFields: {
  label: string
  colSpan: string
  gridCols: string
  placeholder?: string
  children: {
    label: string
    colour: keyof typeof colors
    key?: keyof EventSchema
    type?: string
    items?: any[]
    children?: {
      key: keyof EventSchema
      placeholder: string
      type: string
    }[]
  }[]
}[] = [
  {
    label: "Sponsor Names",
    colSpan: "col-span-2",
    gridCols: "grid-cols-3",
    placeholder: "sponsor name",
    children: [
      { label: "General", colour: "warning", key: "sponsor_name", type: "text" },
      { label: "ATP", colour: "ATP", key: "atp_sponsor_name", type: "text" },
      { label: "WTA", colour: "WTA", key: "wta_sponsor_name", type: "text" }
    ]
  },
  {
    label: "Categories",
    colSpan: "col-span-3",
    gridCols: "grid-cols-5",
    placeholder: "category",
    children: [
      { label: "General", colour: "warning", key: "category", type: "text" },
      { label: "ATP", colour: "ATP", key: "atp_category", type: "text" },
      { label: "WTA", colour: "WTA", key: "wta_category", type: "text" },
      { label: "ITF(M)", colour: "Men", key: "men_category", type: "text" },
      { label: "ITF(W)", colour: "Women", key: "women_category", type: "text" }
    ]
  },
  {
    label: "Dates",
    colSpan: "col-span-3",
    gridCols: "grid-cols-5",
    children: [
      {
        label: "General",
        colour: "warning",
        children: [
          { key: "start_date", placeholder: "Start date", type: "date" },
          { key: "end_date", placeholder: "End date", type: "date" }
        ]
      },
      {
        label: "ATP",
        colour: "ATP",
        children: [
          { key: "atp_start_date", placeholder: "Start date", type: "date" },
          { key: "atp_end_date", placeholder: "End date", type: "date" }
        ]
      },
      {
        label: "WTA",
        colour: "WTA",
        children: [
          { key: "wta_start_date", placeholder: "Start date", type: "date" },
          { key: "wta_end_date", placeholder: "End date", type: "date" }
        ]
      },
      {
        label: "ITF(M)",
        colour: "Men",
        children: [
          { key: "men_start_date", placeholder: "Start date", type: "date" },
          { key: "men_end_date", placeholder: "End date", type: "date" }
        ]
      },
      {
        label: "ITF(W)",
        colour: "Women",
        children: [
          { key: "women_start_date", placeholder: "Start date", type: "date" },
          { key: "women_end_date", placeholder: "End date", type: "date" }
        ]
      }
    ]
  },
  {
    label: "Money",
    colSpan: "col-span-3",
    gridCols: "grid-cols-5",
    children: [
      {
        label: "General",
        colour: "warning",
        key: "currency",
        type: "select",
        items: CURRENCIES,
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
        items: CURRENCIES,
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
        items: CURRENCIES,
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
        items: CURRENCIES,
        children: [{ key: "men_pm", placeholder: "PM", type: "currency" }]
      },
      {
        label: "ITF(W)",
        colour: "Women",
        key: "women_currency",
        type: "select",
        items: CURRENCIES,
        children: [{ key: "women_pm", placeholder: "PM", type: "currency" }]
      }
    ]
  }
]

const handleReset = () => {
  state.id = 0
  state.tournament = { id: 0, label: "" }
  state.year = new Date().getFullYear()
  state.tours = []
  state.supervisors = []
  state.venues = []
}

const handleSubmit = async (event: FormSubmitEvent<EventSchema>) => {
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
    handleReset()
    set(open, false)

    await navigateTo({
      name: "event",
      params: { id: state.tournament.id, name: kebabCase(state.tournament.label), year: state.year, eid: state.id }
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

const onError = (event: FormErrorEvent) => {
  toast.add({
    title: "Error creating event",
    description: event.errors.map(err => err.message).join(", "),
    icon: icons.error,
    color: "error"
  })
}
</script>

<template>
  <u-modal
    title="Create Event"
    v-model:open="open"
    fullscreen
  >
    <u-button
      icon="solar:calendar-add-bold-duotone"
      label="Create Event"
      block
    />

    <template #body>
      <u-form
        id="event-form"
        :schema="eventSchema"
        :state
        @submit="handleSubmit"
        @error="onError"
      >
        {{ state.tournament }}
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
            :class="field.colSpan"
          >
            <u-form-field :label="field.label">
              <div
                class="grid gap-2"
                :class="field.gridCols"
              >
                <u-field-group
                  v-for="item in field.children"
                  :key="item.label"
                >
                  <u-button
                    disabled
                    :color="item.colour"
                    :label="item.label"
                    class="disabled:cursor-default"
                  />

                  <form-input
                    v-if="item.type === 'text'"
                    :id="item.key"
                    v-model="(state[item.key as keyof typeof state] as string)"
                    :placeholder="`Enter ${field.placeholder}`"
                    block
                  />

                  <u-select
                    v-else-if="item.type === 'select'"
                    v-model="state[item.key as keyof typeof state]"
                    :items="item.items"
                    placeholder="e.g., $"
                    class="w-fit"
                  >
                    <template #content-bottom>
                      <!--@vue-ignore-->
                      <u-button
                        @click="state[item.key] = undefined"
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
                    <!--@vue-ignore-->
                    <u-input-number
                      v-if="child.type === 'currency'"
                      :id="child.key"
                      v-model="(state[child.key as keyof typeof state] as number)"
                      :placeholder="child.placeholder"
                      :format-options="{
                        style: 'currency',
                        currency: state[item.key as keyof typeof state] || 'USD'
                      }"
                    >
                      <template #increment>
                        <!--@vue-ignore-->
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

                    <form-date-picker
                      v-else-if="child.type === 'date'"
                      v-model="state[child.key]"
                      :placeholder="child.placeholder"
                    />
                  </template>
                </u-field-group>
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
        block
      />

      <u-button
        label="Reset"
        @click="handleReset"
        :icon="icons.reload"
        block
        color="warning"
      />

      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
        block
      />
    </template>
  </u-modal>
</template>
