<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { parseDate } from "@internationalized/date"
import * as z from "zod"

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

const { data: event, status } = await useFetch<any>("/api/events/get-event", {
  query: { id }
})

type Schema = z.output<typeof eventSchema>

const state = reactive<Partial<Schema>>({
  id: get(event)?.id,
  tournament: get(event)?.tournament,
  tours: get(event)?.tours || [],
  surface: get(event)?.surface,
  supervisors: get(event)?.supervisors || [],
  venues: get(event)?.venues.map((v: any) => v.id) || [],
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

const formFields: FormFieldInterface<Schema>[] = [
  { label: "ID", key: "id", type: "text", subType: "number", required: true },
  { label: "Tournament", key: "tournament", type: "text", disabled: true, required: true },
  { label: "Tours", key: "tours", type: "tags", required: true },
  { label: "Surface", key: "surface", type: "select", items: surfaces },
  { label: "Venues", key: "venues", type: "venues" },
  { label: "Supervisors", key: "supervisors", type: "supervisors" }
]

const tours: { label: string; color: keyof typeof colors }[] = [
  { label: "General", color: "primary" },
  { label: "ATP", color: "ATP" },
  { label: "WTA", color: "WTA" },
  { label: "Men", color: "Men" },
  { label: "Women", color: "Women" }
]

const draws = [
  { label: "singles", key: "s" },
  { label: "doubles", key: "d" },
  { label: "qualifying singles", key: "qs" },
  { label: "qualifying doubles", key: "qd" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
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
      description: (e as Error).message,
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
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <scraping-draw v-if="event.tours.some((tour: string) => ['ATP', 'WTA'].includes(tour))" />
          <scraping-results v-if="event.tours.includes('ATP')" />
          <scraping-stats v-if="event.tours.some((tour: string) => ['ATP', 'WTA'].includes(tour))" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-form
          id="event-form"
          :schema="eventSchema"
          :state
          @submit="onSubmit"
        >
          <u-button
            type="submit"
            label="Save"
            block
            class="mb-3"
            :icon="submitting ? ICONS.uploading : icons.check"
          />
          <div class="grid grid-cols-3 gap-5 items-center">
            <form-field
              v-for="field in formFields"
              :key="field.label"
              :field
              v-model="state[field.key]"
            />

            <div class="col-span-3">
              <u-form-field label="Sponsor Names">
                <div class="grid grid-cols-3 gap-2 *:flex *:flex-col *:gap-1">
                  <div
                    v-for="tour in tours.slice(0, 3)"
                    :key="`sponsor-${tour.label}`"
                  >
                    <label :for="`${tour.label.toLowerCase()}_sponsor_name`">
                      <u-badge
                        :label="tour.label"
                        :color="tour.color"
                        size="md"
                        class="w-full justify-center"
                      />
                    </label>
                    <!--@vue-expect-error-->
                    <u-input
                      :id="`${tour.label.toLowerCase()}_sponsor_name`"
                      v-model="state[tour.label === 'General' ? 'sponsor_name' : `${tour.label.toLowerCase()}_sponsor_name` as keyof typeof state]"
                      :placeholder="`Enter ${tour.label} sponsor name`"
                    />
                  </div>
                </div>
              </u-form-field>
            </div>

            <div class="col-span-3">
              <u-form-field label="Categories">
                <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                  <div
                    v-for="tour in tours"
                    :key="`category-${tour.label}`"
                  >
                    <label :for="`${tour.label.toLowerCase()}_category`">
                      <u-badge
                        :label="tour.label"
                        :color="tour.color"
                        size="md"
                        class="w-full justify-center"
                      />
                    </label>
                    <!--@vue-expect-error-->
                    <u-input
                      :id="`${tour.label.toLowerCase()}_category`"
                      v-model="state[tour.label === 'General' ? 'category' : `${tour.label.toLowerCase()}_category` as keyof typeof state]"
                      :placeholder="`Enter ${tour.label} category`"
                    />
                  </div>
                </div>
              </u-form-field>
            </div>

            <div class="col-span-3">
              <u-form-field
                label="Dates"
                required
              >
                <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                  <div
                    v-for="tour in tours"
                    :key="`date-${tour.label}`"
                  >
                    <label :for="`${tour.label.toLowerCase()}_start_date`">
                      <u-badge
                        :label="tour.label"
                        :color="tour.color"
                        size="md"
                        class="w-full justify-center"
                      />
                    </label>
                    <date-picker
                      :id="`${tour.label.toLowerCase()}_start_date`"
                      v-model=" state[tour.label === 'General' ? 'start_date' : `${tour.label.toLowerCase()}_start_date` as keyof typeof state]"
                      :placeholder="`${tour.label === 'General' ? '' : tour.label + ' '}start date`"
                    />
                    <date-picker
                      :id="`${tour.label.toLowerCase()}_end_date`"
                      v-model=" state[tour.label === 'General' ? 'end_date' : `${tour.label.toLowerCase()}_end_date` as keyof typeof state]"
                      :placeholder="`${tour.label === 'General' ? '' : tour.label + ' '}end date`"
                    />
                  </div>
                </div>
              </u-form-field>
            </div>

            <div class="col-span-3">
              <u-form-field label="Money">
                <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                  <div
                    v-for="tour in tours"
                    :key="`money-${tour.label}`"
                  >
                    <label :for="`${tour.label.toLowerCase()}_currency`">
                      <u-badge
                        :label="tour.label"
                        :color="tour.color"
                        size="md"
                        class="w-full justify-center"
                      />
                    </label>
                    <div class="flex items-center gap-2">
                      <!--@vue-expect-error-->
                      <u-select
                        v-model="state[tour.label === 'General' ? 'currency' : `${tour.label.toLowerCase()}_currency` as keyof typeof state]"
                        :items="currencies"
                        placeholder="e.g. $"
                        class="w-fit"
                      >
                        <template #content-bottom>
                          <u-button
                            @click="state.currency = undefined"
                            size="sm"
                            label="Clear"
                          />
                        </template>
                      </u-select>
                      <!--@vue-expect-error-->
                      <u-input-number
                        v-model="state[tour.label === 'General' ? 'pm' : `${tour.label.toLowerCase()}_pm` as keyof typeof state]"
                        :placeholder="`Enter ${tour.label === 'General' ? '' : tour.label + ' '}prize money`"
                        :step="0.01"
                        :format-options="{
                          style: 'currency',
                          currency: state[tour.label === 'General' ? 'currency' : `${tour.label.toLowerCase()}_currency` as keyof typeof state] || 'USD'
                        }"
                      >
                        <template #increment>
                          <u-button
                            v-if="state[tour.label === 'General' ? 'pm' : `${tour.label.toLowerCase()}_pm` as keyof typeof state] !== undefined"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                            :icon="icons.close"
                            aria-label="Clear input"
                            @click="state[tour.label === 'General' ? 'pm' : (`${tour.label.toLowerCase()}_pm` as keyof typeof state)] = undefined"
                          />
                          <template v-else>{{ "" }}</template>
                        </template>
                      </u-input-number>
                    </div>
                    <!--@vue-expect-error-->
                    <u-input-number
                      v-if="!['Men', 'Women'].includes(tour.label)"
                      v-model="state[tour.label === 'General' ? 'tfc' : `${tour.label.toLowerCase()}_tfc` as keyof typeof state]"
                      :placeholder="`Enter ${tour.label === 'General' ? '' : tour.label + ' '}total financial commitment`"
                      :step="0.01"
                      :format-options="{
                          style: 'currency',
                          currency: state[tour.label === 'General' ? 'currency' : `${tour.label.toLowerCase()}_currency` as keyof typeof state] || 'USD'
                        }"
                    >
                      <template #increment>
                        <u-button
                          v-if="state[tour.label === 'General' ? 'tfc' : `${tour.label.toLowerCase()}_tfc` as keyof typeof state] !== undefined"
                          color="neutral"
                          variant="ghost"
                          size="xs"
                          :icon="icons.close"
                          aria-label="Clear input"
                          @click="state[tour.label === 'General' ? 'tfc' : (`${tour.label.toLowerCase()}_tfc` as keyof typeof state)] = undefined"
                        />
                        <template v-else>{{ "" }}</template>
                      </template>
                    </u-input-number>
                  </div>
                </div>
              </u-form-field>
            </div>

            <div class="col-span-3">
              <u-form-field
                label="Links"
                required
              >
                <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                  <div
                    v-for="tour in tours"
                    :key="`link-${tour.label}`"
                  >
                    <label :for="`${tour.label.toLowerCase()}_link`">
                      <u-badge
                        :label="tour.label === 'General' ? 'Wikipedia' : tour.label"
                        :color="tour.color"
                        class="w-full justify-center"
                        size="md"
                      />
                    </label>
                    <!--@vue-expect-error-->
                    <u-textarea
                      :id="`${tour.label.toLowerCase()}_link`"
                      v-model="state[tour.label === 'General' ? 'wiki_link' : `${tour.label.toLowerCase()}_link`]"
                      :placeholder="`Enter ${tour.label === 'General' ? 'Wikipedia' : tour.label} link`"
                    />
                  </div>
                </div>
              </u-form-field>
            </div>

            <div class="col-span-3">
              <u-form-field
                label="Draws"
                required
              >
                <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                  <div>
                    <label for="draw_link">
                      <u-badge
                        label="General"
                        class="w-full justify-center"
                        size="md"
                      />
                    </label>
                    <u-select
                      id="draw_type"
                      v-model="state.draw_type"
                      placeholder="Enter draw type"
                      :items="drawOptions"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.draw_type = undefined"
                          size="xs"
                          label="Clear"
                          :icon="icons.close"
                          block
                        />
                      </template>
                    </u-select>
                    <u-textarea
                      v-model="state.draw_link"
                      placeholder="Enter draw link"
                    />
                  </div>

                  <div
                    v-for="tour in tours.slice(1)"
                    :key="`draw-${tour.label}`"
                  >
                    <label :for="`${tour.label.toLowerCase()}_draw_s`">
                      <u-badge
                        :label="tour.label"
                        :color="tour.color"
                        size="md"
                        class="w-full justify-center"
                      />
                    </label>

                    <template
                      v-for="draw in draws"
                      :key="draw.key"
                    >
                      <!--@vue-expect-error-->
                      <u-select
                        :id="`${tour.label.toLowerCase()}_draw_${draw.key}`"
                        v-model="state[`${tour.label.toLowerCase()}_draw_${draw.key}` as keyof typeof state]"
                        :placeholder="`Enter ${tour.label} ${draw.label} draw`"
                        :items="drawOptions"
                      >
                        <template #content-bottom>
                          <u-button
                            @click="state[`${tour.label.toLowerCase()}_draw_${draw.key}` as keyof typeof state] = undefined"
                            size="xs"
                            label="Clear"
                            :icon="icons.close"
                            block
                          />
                        </template>
                      </u-select>
                      <!--@vue-expect-error-->
                      <u-textarea
                        v-model="state[`${tour.label.toLowerCase()}_draw_${draw.key}_link` as keyof typeof state]"
                        :placeholder="`Enter ${tour.label} ${draw.label} draw link`"
                      />
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
