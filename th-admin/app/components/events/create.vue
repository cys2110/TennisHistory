<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const open = ref(false)
const toast = useToast()

type Schema = z.output<typeof eventSchema>

const state = reactive<Partial<Schema>>({
  id: 0,
  tours: [],
  supervisors: [],
  venues: []
})

const {
  data: supervisors,
  status: supervisorStatus,
  execute: executeSupervisors,
  refresh: refreshSupervisors
} = await useFetch<any>("/api/supervisors/get", {
  default: () => [],
  immediate: false
})

const {
  data: venues,
  status: venueStatus,
  execute: executeVenues,
  refresh: refreshVenues
} = await useFetch<{ country: { code: string; name: string }; id: string; label: string }[]>("/api/venues/get", {
  default: () => [],
  immediate: false
})

const { data: tournaments, status: tournamentStatus } = await useFetch<TournamentInterface[]>("/api/tournaments/get", { default: () => [] })

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/events/create", {
      query: event.data
    })
    toast.add({
      title: "Event created",
      icon: "lucide:circle-check",
      color: "success"
    })
    set(open, false)
  } catch (e) {
    toast.add({
      title: "Error creating event",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
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
      size="sm"
    />

    <template #body>
      <u-form
        id="event-form"
        :schema="eventSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-3 gap-2 items-center">
          <u-form-field label="ID">
            <u-input
              type="number"
              v-model="state.id"
              placeholder="Enter event ID"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Tournament">
            <u-select-menu
              v-model="state.tournament"
              :loading="['pending', 'idle'].includes(tournamentStatus)"
              :items="tournaments || []"
              label-key="name"
              value-key="id"
              placeholder="Select tournament"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Year">
            <u-select-menu
              v-model="state.year"
              :items="ALL_YEARS"
              placeholder="Select year"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Tours">
            <u-input-tags
              v-model="state.tours"
              placeholder="Enter event tours"
              class="w-full"
              delimiter=","
            />
          </u-form-field>

          <div class="col-span-2">
            <u-form-field label="Sponsor Names">
              <div class="grid grid-cols-3 gap-2 *:flex *:flex-col *:gap-1">
                <div>
                  <label for="sponsor_name">
                    <u-badge label="General" />
                  </label>
                  <u-input
                    id="sponsor_name"
                    v-model="state.sponsor_name"
                    placeholder="Enter sponsor name"
                  />
                </div>

                <div>
                  <label for="atp_sponsor_name">
                    <u-badge
                      label="ATP"
                      color="ATP"
                    />
                  </label>
                  <u-input
                    id="atp_sponsor_name"
                    v-model="state.atp_sponsor_name"
                    placeholder="Enter ATP sponsor name"
                  />
                </div>

                <div>
                  <label for="wta_sponsor_name">
                    <u-badge
                      label="WTA"
                      color="WTA"
                    />
                  </label>
                  <u-input
                    id="wta_sponsor_name"
                    v-model="state.wta_sponsor_name"
                    placeholder="Enter WTA sponsor name"
                  />
                </div>
              </div>
            </u-form-field>
          </div>

          <div class="col-span-3">
            <u-form-field label="Categories">
              <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                <div>
                  <label for="category">
                    <u-badge label="General" />
                  </label>
                  <u-input
                    id="category"
                    v-model="state.category"
                    placeholder="Enter category"
                  />
                </div>

                <div>
                  <label for="atp_category">
                    <u-badge
                      label="ATP"
                      color="ATP"
                    />
                  </label>
                  <u-input
                    id="atp_category"
                    v-model="state.atp_category"
                    placeholder="Enter ATP category"
                  />
                </div>

                <div>
                  <label for="wta_category">
                    <u-badge
                      label="WTA"
                      color="WTA"
                    />
                  </label>
                  <u-input
                    id="wta_category"
                    v-model="state.wta_category"
                    placeholder="Enter WTA category"
                  />
                </div>

                <div>
                  <label for="men_category">
                    <u-badge
                      label="Men"
                      color="Men"
                    />
                  </label>
                  <u-input
                    id="men_category"
                    v-model="state.men_category"
                    placeholder="Enter Men category"
                  />
                </div>

                <div>
                  <label for="women_category">
                    <u-badge
                      label="Women"
                      color="Women"
                    />
                  </label>
                  <u-input
                    id="women_category"
                    v-model="state.women_category"
                    placeholder="Enter Women category"
                  />
                </div>
              </div>
            </u-form-field>
          </div>

          <div class="col-span-3">
            <u-form-field label="Dates">
              <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                <div>
                  <label for="start_date">
                    <u-badge label="General" />
                  </label>
                  <date-picker
                    id="start_date"
                    v-model="state.start_date"
                    placeholder="Select start date"
                  />
                  <date-picker
                    id="end_date"
                    v-model="state.end_date"
                    placeholder="Select end date"
                  />
                </div>

                <div>
                  <label for="atp_start_date">
                    <u-badge
                      label="ATP"
                      color="ATP"
                    />
                  </label>
                  <date-picker
                    id="atp_start_date"
                    v-model="state.atp_start_date"
                    placeholder="Select ATP start date"
                  />
                  <date-picker
                    id="atp_end_date"
                    v-model="state.atp_end_date"
                    placeholder="Select ATP end date"
                  />
                </div>

                <div>
                  <label for="wta_start_date">
                    <u-badge
                      label="WTA"
                      color="WTA"
                    />
                  </label>
                  <date-picker
                    id="wta_start_date"
                    v-model="state.wta_start_date"
                    placeholder="Select WTA start date"
                  />
                  <date-picker
                    id="wta_end_date"
                    v-model="state.wta_end_date"
                    placeholder="Select WTA end date"
                  />
                </div>

                <div>
                  <label for="men_start_date">
                    <u-badge
                      label="Men"
                      color="Men"
                    />
                  </label>
                  <date-picker
                    id="men_start_date"
                    v-model="state.men_start_date"
                    placeholder="Select Men start date"
                  />
                  <date-picker
                    id="men_end_date"
                    v-model="state.men_end_date"
                    placeholder="Select Men end date"
                  />
                </div>

                <div>
                  <label for="women_start_date">
                    <u-badge
                      label="Women"
                      color="Women"
                    />
                  </label>
                  <date-picker
                    id="women_start_date"
                    v-model="state.women_start_date"
                    placeholder="Select Women start date"
                  />
                  <date-picker
                    id="women_end_date"
                    v-model="state.women_end_date"
                    placeholder="Select Women end date"
                  />
                </div>
              </div>
            </u-form-field>
          </div>

          <u-form-field label="Surface">
            <u-select
              v-model="state.surface"
              :items="surfaces"
              placeholder="Select surface"
              class="w-full"
            />
          </u-form-field>

          <u-form-field label="Venues">
            {{ state.venues?.join(", ") }}
            <u-select-menu
              v-model="state.venues"
              :loading="venueStatus === 'pending'"
              :items="venues || []"
              multiple
              label-key="label"
              value-key="id"
              class="w-full"
              placeholder="Select venues"
              @update:open="
                () => {
                  if (venues.length) {
                    refreshVenues()
                  } else {
                    executeVenues()
                  }
                }
              "
            >
              <template #content-bottom>
                <venues-create />
              </template>
            </u-select-menu>
          </u-form-field>

          <u-form-field label="Supervisors">
            <div>{{ state.supervisors?.join(", ") }}</div>
            <u-select-menu
              v-model="state.supervisors"
              :loading="supervisorStatus === 'pending'"
              :items="supervisors.map((s: any) => s.id) || []"
              multiple
              class="w-full"
              placeholder="Select supervisors"
              @update:open="
                () => {
                  if (supervisors.length) {
                    refreshSupervisors()
                  } else {
                    executeSupervisors()
                  }
                }
              "
            >
              <template #content-bottom>
                <create-person type="Supervisor" />
              </template>
            </u-select-menu>
          </u-form-field>

          <div class="col-span-3">
            <u-form-field label="Money">
              <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                <div>
                  <label for="currency">
                    <u-badge label="General" />
                  </label>
                  <div class="flex items-center gap-2">
                    <u-select
                      v-model="state.currency"
                      :items="currencies"
                      placeholder="e.g. $"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.currency = undefined"
                          size="sm"
                          label="Clear"
                        />
                      </template>
                    </u-select>
                    <u-input-number
                      v-model="state.pm"
                      orientation="vertical"
                      placeholder="Enter prize money"
                      class="w-full"
                      :format-options="{
                        style: 'currency',
                        currency: state.currency || 'USD'
                      }"
                    />
                  </div>
                  <u-input-number
                    v-model="state.tfc"
                    orientation="vertical"
                    placeholder="Enter total financial commitment"
                    :format-options="{
                      style: 'currency',
                      currency: state.currency || 'USD'
                    }"
                  />
                </div>

                <div>
                  <label for="atp_currency">
                    <u-badge
                      label="ATP"
                      color="ATP"
                    />
                  </label>
                  <div class="flex items-center gap-2">
                    <u-select
                      v-model="state.atp_currency"
                      :items="currencies"
                      placeholder="e.g. $"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.atp_currency = undefined"
                          size="sm"
                          label="Clear"
                        />
                      </template>
                    </u-select>
                    <u-input-number
                      v-model="state.atp_pm"
                      orientation="vertical"
                      placeholder="Enter ATP prize money"
                      class="w-full"
                      :format-options="{
                        style: 'currency',
                        currency: state.atp_currency || 'USD'
                      }"
                    />
                  </div>
                  <u-input-number
                    v-model="state.atp_tfc"
                    orientation="vertical"
                    placeholder="Enter ATP total financial commitment"
                    :format-options="{
                      style: 'currency',
                      currency: state.atp_currency || 'USD'
                    }"
                  />
                </div>

                <div>
                  <label for="wta_currency">
                    <u-badge
                      label="WTA"
                      color="WTA"
                    />
                  </label>
                  <div class="flex items-center gap-2">
                    <u-select
                      v-model="state.wta_currency"
                      :items="currencies"
                      placeholder="e.g. $"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.wta_currency = undefined"
                          size="sm"
                          label="Clear"
                        />
                      </template>
                    </u-select>
                    <u-input-number
                      v-model="state.wta_pm"
                      orientation="vertical"
                      placeholder="Enter WTA prize money"
                      class="w-full"
                      :format-options="{
                        style: 'currency',
                        currency: state.wta_currency || 'USD'
                      }"
                    />
                  </div>
                  <u-input-number
                    v-model="state.wta_tfc"
                    orientation="vertical"
                    placeholder="Enter WTA total financial commitment"
                    :format-options="{
                      style: 'currency',
                      currency: state.wta_currency || 'USD'
                    }"
                  />
                </div>

                <div>
                  <label for="men_currency">
                    <u-badge
                      label="Men"
                      color="Men"
                    />
                  </label>
                  <div class="flex items-center gap-2">
                    <u-select
                      v-model="state.men_currency"
                      :items="currencies"
                      placeholder="e.g. $"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.men_currency = undefined"
                          size="sm"
                          label="Clear"
                        />
                      </template>
                    </u-select>
                    <u-input-number
                      v-model="state.men_pm"
                      orientation="vertical"
                      placeholder="Enter Men prize money"
                      class="w-full"
                      :format-options="{
                        style: 'currency',
                        currency: state.men_currency || 'USD'
                      }"
                    />
                  </div>
                </div>

                <div>
                  <label for="women_currency">
                    <u-badge
                      label="Women"
                      color="Women"
                    />
                  </label>
                  <div class="flex items-center gap-2">
                    <u-select
                      v-model="state.women_currency"
                      :items="currencies"
                      placeholder="e.g. $"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.women_currency = undefined"
                          size="sm"
                          label="Clear"
                        />
                      </template>
                    </u-select>
                    <u-input-number
                      v-model="state.women_pm"
                      orientation="vertical"
                      placeholder="Enter Women prize money"
                      class="w-full"
                      :format-options="{
                        style: 'currency',
                        currency: state.women_currency || 'USD'
                      }"
                    />
                  </div>
                </div>
              </div>
            </u-form-field>
          </div>

          <div class="col-span-3">
            <u-form-field label="Links">
              <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                <div>
                  <label for="wiki_link">
                    <u-badge label="Wiki" />
                  </label>
                  <u-textarea
                    id="wiki_link"
                    v-model="state.wiki_link"
                    placeholder="Enter wikipedia link"
                  />
                </div>

                <div>
                  <label for="atp_link">
                    <u-badge
                      label="ATP"
                      color="ATP"
                    />
                  </label>
                  <u-textarea
                    id="atp_link"
                    v-model="state.atp_link"
                    placeholder="Enter ATP link"
                  />
                </div>

                <div>
                  <label for="wta_link">
                    <u-badge
                      label="WTA"
                      color="WTA"
                    />
                  </label>
                  <u-textarea
                    id="wta_link"
                    v-model="state.wta_link"
                    placeholder="Enter WTA link"
                  />
                </div>

                <div>
                  <label for="men_link">
                    <u-badge
                      label="Men"
                      color="Men"
                    />
                  </label>
                  <u-textarea
                    id="men_link"
                    v-model="state.men_link"
                    placeholder="Enter Men link"
                  />
                </div>

                <div>
                  <label for="women_link">
                    <u-badge
                      label="Women"
                      color="Women"
                    />
                  </label>
                  <u-textarea
                    id="women_link"
                    v-model="state.women_link"
                    placeholder="Enter Women link"
                  />
                </div>
              </div>
            </u-form-field>
          </div>

          <div class="col-span-3">
            <u-form-field label="Draws">
              <div class="grid grid-cols-5 gap-2 *:flex *:flex-col *:gap-1">
                <div>
                  <label for="draw_link">
                    <u-badge label="General" />
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
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.draw_link"
                    placeholder="Enter draw link"
                  />
                </div>

                <div>
                  <label for="atp_draw_s">
                    <u-badge
                      label="ATP"
                      color="ATP"
                    />
                  </label>
                  <u-select
                    id="atp_draw_s"
                    v-model="state.atp_draw_s"
                    placeholder="Enter ATP singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.atp_draw_s = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.atp_draw_s_link"
                    placeholder="Enter ATP singles draw link"
                  />
                  <u-select
                    id="atp_draw_d"
                    v-model="state.atp_draw_d"
                    placeholder="Enter ATP doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.atp_draw_d = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.atp_draw_d_link"
                    placeholder="Enter ATP doubles draw link"
                  />
                  <u-select
                    id="atp_draw_qs"
                    v-model="state.atp_draw_qs"
                    placeholder="Enter ATP qualifying singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.atp_draw_qs = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.atp_draw_qs_link"
                    placeholder="Enter ATP qualifying singles draw link"
                  />
                  <u-select
                    id="atp_draw_qd"
                    v-model="state.atp_draw_qd"
                    placeholder="Enter ATP qualifying doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.atp_draw_qd = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.atp_draw_qd_link"
                    placeholder="Enter ATP qualifying doubles draw link"
                  />
                </div>

                <div>
                  <label for="wta_draw_s">
                    <u-badge
                      label="WTA"
                      color="WTA"
                    />
                  </label>
                  <u-select
                    id="wta_draw_s"
                    v-model="state.wta_draw_s"
                    placeholder="Enter WTA singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.wta_draw_s = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.wta_draw_s_link"
                    placeholder="Enter WTA singles draw link"
                  />
                  <u-select
                    id="wta_draw_d"
                    v-model="state.wta_draw_d"
                    placeholder="Enter WTA doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.wta_draw_d = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.wta_draw_d_link"
                    placeholder="Enter WTA doubles draw link"
                  />
                  <u-select
                    id="wta_draw_qs"
                    v-model="state.wta_draw_qs"
                    placeholder="Enter WTA qualifying singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.wta_draw_qs = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.wta_draw_qs_link"
                    placeholder="Enter WTA qualifying singles draw link"
                  />
                  <u-select
                    id="wta_draw_qd"
                    v-model="state.wta_draw_qd"
                    placeholder="Enter WTA qualifying doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.wta_draw_qd = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.wta_draw_qd_link"
                    placeholder="Enter WTA qualifying doubles draw link"
                  />
                </div>

                <div>
                  <label for="men_draw_s">
                    <u-badge
                      label="Men"
                      color="Men"
                    />
                  </label>
                  <u-select
                    id="men_draw_s"
                    v-model="state.men_draw_s"
                    placeholder="Enter Men singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.men_draw_s = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.men_draw_s_link"
                    placeholder="Enter Men singles draw link"
                  />
                  <u-select
                    id="men_draw_d"
                    v-model="state.men_draw_d"
                    placeholder="Enter Men doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.men_draw_d = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.men_draw_d_link"
                    placeholder="Enter Men doubles draw link"
                  />
                  <u-select
                    id="men_draw_qs"
                    v-model="state.men_draw_qs"
                    placeholder="Enter Men qualifying singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.men_draw_qs = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.men_draw_qs_link"
                    placeholder="Enter Men qualifying singles draw link"
                  />
                  <u-select
                    id="men_draw_qd"
                    v-model="state.men_draw_qd"
                    placeholder="Enter Men qualifying doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.men_draw_qd = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.men_draw_qd_link"
                    placeholder="Enter Men qualifying doubles draw link"
                  />
                </div>

                <div>
                  <label for="women_draw_s">
                    <u-badge
                      label="Women"
                      color="Women"
                    />
                  </label>
                  <u-select
                    id="women_draw_s"
                    v-model="state.women_draw_s"
                    placeholder="Enter Women singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.women_draw_s = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.women_draw_s_link"
                    placeholder="Enter Women singles draw link"
                  />
                  <u-select
                    id="women_draw_d"
                    v-model="state.women_draw_d"
                    placeholder="Enter Women doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.women_draw_d = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.women_draw_d_link"
                    placeholder="Enter Women doubles draw link"
                  />
                  <u-select
                    id="women_draw_qs"
                    v-model="state.women_draw_qs"
                    placeholder="Enter Women qualifying singles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.women_draw_qs = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.women_draw_qs_link"
                    placeholder="Enter Women qualifying singles draw link"
                  />
                  <u-select
                    id="women_draw_qd"
                    v-model="state.women_draw_qd"
                    placeholder="Enter Women qualifying doubles draw"
                    :items="drawOptions"
                  >
                    <template #content-bottom>
                      <u-button
                        @click="state.women_draw_qd = undefined"
                        size="sm"
                        label="Clear"
                      />
                    </template>
                  </u-select>
                  <u-textarea
                    v-model="state.women_draw_qd_link"
                    placeholder="Enter Women qualifying doubles draw link"
                  />
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
        icon="lucide:square-check-big"
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        icon="lucide:circle-x"
      />
    </template>
  </u-modal>
</template>
