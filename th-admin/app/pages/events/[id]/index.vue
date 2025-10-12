<script setup>
import { parseDate } from "@internationalized/date"

definePageMeta({ name: "event" })
useHead({ title: "Edit Event - TH Admin" })

const {
  params: { id }
} = useRoute("event")
const toast = useToast()
const {
  ui: { icons, colors }
} = useAppConfig()
const submitting = ref(false)

const form = useTemplateRef("form")

const { data: event, status } = await useFetch("/api/events/get-event", {
  query: { id }
})

defineShortcuts({
  meta_enter: () => form.value?.submit()
})

const state = reactive({
  id: get(event)?.id,
  tournament: get(event)?.tournament,
  tours: get(event)?.tours.filter(tour => tour !== "Update") || [],
  surface: get(event)?.surface,
  supervisors: get(event)?.supervisors || [],
  venues: get(event)?.venues.map(v => v.id) || [],
  atp_link: get(event)?.atp_link,
  wta_link: get(event)?.wta_link,
  men_link: get(event)?.men_link,
  women_link: get(event)?.women_link,
  wiki_link: get(event)?.wiki_link,
  category: get(event)?.category,
  atp_category: get(event)?.atp_category,
  wta_category: get(event)?.wta_category,
  men_category: get(event)?.men_category,
  women_category: get(event)?.women_category,
  sponsor_name: get(event)?.sponsor_name,
  atp_sponsor_name: get(event)?.atp_sponsor_name,
  wta_sponsor_name: get(event)?.wta_sponsor_name,
  draw_type: get(event)?.draw_type,
  atp_draw_s: get(event)?.atp_draw_s,
  atp_draw_d: get(event)?.atp_draw_d,
  atp_draw_qs: get(event)?.atp_draw_qs,
  atp_draw_qd: get(event)?.atp_draw_qd,
  wta_draw_s: get(event)?.wta_draw_s,
  wta_draw_d: get(event)?.wta_draw_d,
  wta_draw_qs: get(event)?.wta_draw_qs,
  wta_draw_qd: get(event)?.wta_draw_qd,
  men_draw_s: get(event)?.men_draw_s,
  men_draw_d: get(event)?.men_draw_d,
  men_draw_qs: get(event)?.men_draw_qs,
  men_draw_qd: get(event)?.men_draw_qd,
  women_draw_s: get(event)?.women_draw_s,
  women_draw_d: get(event)?.women_draw_d,
  women_draw_qs: get(event)?.women_draw_qs,
  women_draw_qd: get(event)?.women_draw_qd,
  atp_draw_s_link: get(event)?.atp_draw_s_link,
  atp_draw_d_link: get(event)?.atp_draw_d_link,
  atp_draw_qs_link: get(event)?.atp_draw_qs_link,
  atp_draw_qd_link: get(event)?.atp_draw_qd_link,
  wta_draw_s_link: get(event)?.wta_draw_s_link,
  wta_draw_d_link: get(event)?.wta_draw_d_link,
  wta_draw_qs_link: get(event)?.wta_draw_qs_link,
  wta_draw_qd_link: get(event)?.wta_draw_qd_link,
  men_draw_s_link: get(event)?.men_draw_s_link,
  men_draw_d_link: get(event)?.men_draw_d_link,
  men_draw_qs_link: get(event)?.men_draw_qs_link,
  men_draw_qd_link: get(event)?.men_draw_qd_link,
  women_draw_s_link: get(event)?.women_draw_s_link,
  women_draw_d_link: get(event)?.women_draw_d_link,
  women_draw_qs_link: get(event)?.women_draw_qs_link,
  women_draw_qd_link: get(event)?.women_draw_qd_link,
  currency: get(event)?.currency,
  atp_currency: get(event)?.atp_currency,
  wta_currency: get(event)?.wta_currency,
  men_currency: get(event)?.men_currency,
  women_currency: get(event)?.women_currency,
  pm: get(event)?.pm,
  atp_pm: get(event)?.atp_pm,
  wta_pm: get(event)?.wta_pm,
  men_pm: get(event)?.men_pm,
  women_pm: get(event)?.women_pm,
  atp_tfc: get(event)?.atp_tfc,
  wta_tfc: get(event)?.wta_tfc,
  start_date: get(event)?.start_date ? parseDate(get(event)?.start_date) : undefined,
  end_date: get(event)?.end_date ? parseDate(get(event)?.end_date) : undefined,
  atp_start_date: get(event)?.atp_start_date ? parseDate(get(event)?.atp_start_date) : undefined,
  atp_end_date: get(event)?.atp_end_date ? parseDate(get(event)?.atp_end_date) : undefined,
  wta_start_date: get(event)?.wta_start_date ? parseDate(get(event)?.wta_start_date) : undefined,
  wta_end_date: get(event)?.wta_end_date ? parseDate(get(event)?.wta_end_date) : undefined,
  men_start_date: get(event)?.men_start_date ? parseDate(get(event)?.men_start_date) : undefined,
  men_end_date: get(event)?.men_end_date ? parseDate(get(event)?.men_end_date) : undefined,
  women_start_date: get(event)?.women_start_date ? parseDate(get(event)?.women_start_date) : undefined,
  women_end_date: get(event)?.women_end_date ? parseDate(get(event)?.women_end_date) : undefined
})

const formFields = [
  { label: "Tournament", key: "tournament", type: "text", disabled: true, required: true },
  { label: "Tours", key: "tours", type: "checkbox", items: tours, required: true },
  { label: "Surface", key: "surface", type: "select", items: surfaces },
  { label: "Venues", key: "venues", type: "venues" },
  { label: "Supervisors", key: "supervisors", type: "supervisors" }
]

const buttonFields = [
  {
    label: "Links",
    children: [
      { label: "Wiki", colour: "warning", key: "wiki_link", type: "textarea" },
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
        colour: "warning",
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

const groupFields = [
  {
    label: "Sponsor Names",
    colSpan: 3,
    gridCols: 3,
    children: [
      { label: "General", colour: "warning", key: "sponsor_name", type: "text" },
      { label: "ATP", colour: "ATP", key: "atp_sponsor_name", type: "text" },
      { label: "WTA", colour: "WTA", key: "wta_sponsor_name", type: "text" }
    ]
  },
  {
    label: "Categories",
    colSpan: 4,
    gridCols: 5,
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
    colSpan: 4,
    gridCols: 5,
    children: [
      {
        label: "General",
        colour: "warning",
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
    colSpan: 4,
    gridCols: 5,
    children: [
      {
        label: "General",
        colour: "warning",
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

const onSubmit = async event => {
  set(submitting, true)
  try {
    await $fetch("/api/events/update", {
      query: event.data
    })
    toast.add({
      title: "Event updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating event",
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(submitting, false)
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Edit Event - ${id}`">
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <scraping-draw v-if="event.tours.some(tour => ['ATP', 'WTA'].includes(tour))" />
          <scraping-results v-if="event.tours.includes('ATP')" />
          <scraping-stats v-if="event.tours.some(tour => ['ATP', 'WTA'].includes(tour))" />
          <u-button
            form="event-form"
            type="submit"
            label="Save"
            block
            :icon="submitting ? ICONS.uploading : icons.check"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-form
          id="event-form"
          ref="form"
          :schema="eventSchema"
          :state
          @submit="onSubmit"
        >
          <div class="grid grid-cols-4 gap-5 items-center">
            <form-field
              v-for="field in formFields"
              :key="field.label"
              :field
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
                      v-model="state[item.key]"
                      :placeholder="`Enter ${field.label.toLowerCase()}`"
                    >
                      <template
                        v-if="state[item.key]?.length"
                        #trailing
                      >
                        <u-button
                          color="neutral"
                          variant="link"
                          size="xs"
                          :icon="icons.close"
                          aria-label="Clear input"
                          @click="state[item.key] = undefined"
                        />
                      </template>
                    </u-input>

                    <u-select
                      v-else-if="item.type === 'select'"
                      v-model="state[item.key]"
                      :items="item.items || []"
                      placeholder="e.g. $"
                      class="w-fit"
                    >
                      <template #content-bottom>
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
                      <date-picker
                        v-if="child.type === 'date'"
                        v-model="state[child.key]"
                        :placeholder="child.placeholder"
                      />

                      <u-input-number
                        v-else-if="child.type === 'currency'"
                        :id="child.key"
                        v-model="state[child.key]"
                        :placeholder="child.placeholder"
                        :format-options="{
                          style: 'currency',
                          currency: state[item.key] || 'USD'
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
              class="col-span-4"
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
                      v-model="state[item.key]"
                      placeholder="Enter link"
                    >
                      <template
                        v-if="state[item.key]?.length"
                        #trailing
                      >
                        <u-button
                          color="neutral"
                          variant="link"
                          size="xs"
                          :icon="icons.close"
                          aria-label="Clear input"
                          @click="state[item.key] = undefined"
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
                        v-model="state[child.key]"
                        :placeholder="`Enter ${child.placeholder}`"
                      >
                        <template
                          v-if="state[child.key]?.length"
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
                        v-model="state[child.key]"
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
    </u-dashboard-panel>
  </div>
</template>
