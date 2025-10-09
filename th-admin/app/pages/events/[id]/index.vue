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

const { data: event, status } = await useFetch<any>("/api/events/get-event", {
  query: { id }
})
const {
  data: supervisors,
  status: supervisorStatus,
  execute: executeSupervisors,
  refresh: refreshSupervisors
} = await useFetch("/api/supervisors/get", {
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

type Schema = z.output<typeof eventSchema>

const state = reactive<Partial<Schema>>({
  id: event.value?.id,
  tours: event.value?.tours || [],
  surface: event.value?.surface,
  supervisors: event.value?.supervisors || [],
  venues: event.value?.venues.map((v: any) => v.id) || [],
  atp_link: event.value?.atp_link,
  wta_link: event.value?.wta_link,
  men_link: event.value?.men_link,
  women_link: event.value?.women_link,
  wiki_link: event.value?.wiki_link,
  category: event.value?.category,
  atp_category: event.value?.atp_category,
  wta_category: event.value?.wta_category,
  men_category: event.value?.men_category,
  women_category: event.value?.women_category,
  sponsor_name: event.value?.sponsor_name,
  atp_sponsor_name: event.value?.atp_sponsor_name,
  wta_sponsor_name: event.value?.wta_sponsor_name,
  draw_type: event.value?.draw_type,
  atp_draw_s: event.value?.atp_draw_s,
  atp_draw_d: event.value?.atp_draw_d,
  atp_draw_qs: event.value?.atp_draw_qs,
  atp_draw_qd: event.value?.atp_draw_qd,
  wta_draw_s: event.value?.wta_draw_s,
  wta_draw_d: event.value?.wta_draw_d,
  wta_draw_qs: event.value?.wta_draw_qs,
  wta_draw_qd: event.value?.wta_draw_qd,
  men_draw_s: event.value?.men_draw_s,
  men_draw_d: event.value?.men_draw_d,
  men_draw_qs: event.value?.men_draw_qs,
  men_draw_qd: event.value?.men_draw_qd,
  women_draw_s: event.value?.women_draw_s,
  women_draw_d: event.value?.women_draw_d,
  women_draw_qs: event.value?.women_draw_qs,
  women_draw_qd: event.value?.women_draw_qd,
  atp_draw_s_link: event.value?.atp_draw_s_link,
  atp_draw_d_link: event.value?.atp_draw_d_link,
  atp_draw_qs_link: event.value?.atp_draw_qs_link,
  atp_draw_qd_link: event.value?.atp_draw_qd_link,
  wta_draw_s_link: event.value?.wta_draw_s_link,
  wta_draw_d_link: event.value?.wta_draw_d_link,
  wta_draw_qs_link: event.value?.wta_draw_qs_link,
  wta_draw_qd_link: event.value?.wta_draw_qd_link,
  men_draw_s_link: event.value?.men_draw_s_link,
  men_draw_d_link: event.value?.men_draw_d_link,
  men_draw_qs_link: event.value?.men_draw_qs_link,
  men_draw_qd_link: event.value?.men_draw_qd_link,
  women_draw_s_link: event.value?.women_draw_s_link,
  women_draw_d_link: event.value?.women_draw_d_link,
  women_draw_qs_link: event.value?.women_draw_qs_link,
  women_draw_qd_link: event.value?.women_draw_qd_link,
  currency: event.value?.currency,
  atp_currency: event.value?.atp_currency,
  wta_currency: event.value?.wta_currency,
  men_currency: event.value?.men_currency,
  women_currency: event.value?.women_currency,
  pm: event.value?.pm,
  atp_pm: event.value?.atp_pm,
  wta_pm: event.value?.wta_pm,
  men_pm: event.value?.men_pm,
  women_pm: event.value?.women_pm,
  atp_tfc: event.value?.atp_tfc,
  wta_tfc: event.value?.wta_tfc,
  start_date: event.value?.start_date ? parseDate(event.value?.start_date) : undefined,
  end_date: event.value?.end_date ? parseDate(event.value?.end_date) : undefined,
  atp_start_date: event.value?.atp_start_date ? parseDate(event.value?.atp_start_date) : undefined,
  atp_end_date: event.value?.atp_end_date ? parseDate(event.value?.atp_end_date) : undefined,
  wta_start_date: event.value?.wta_start_date ? parseDate(event.value?.wta_start_date) : undefined,
  wta_end_date: event.value?.wta_end_date ? parseDate(event.value?.wta_end_date) : undefined,
  men_start_date: event.value?.men_start_date ? parseDate(event.value?.men_start_date) : undefined,
  men_end_date: event.value?.men_end_date ? parseDate(event.value?.men_end_date) : undefined,
  women_start_date: event.value?.women_start_date ? parseDate(event.value?.women_start_date) : undefined,
  women_end_date: event.value?.women_end_date ? parseDate(event.value?.women_end_date) : undefined
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/events/update", {
      query: event.data
    })
    toast.add({
      title: "Event updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating event",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
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
              <u-button
                icon="lucide:layers-3"
                size="sm"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <scraping-draw />
          <scraping-results />
          <scraping-stats />
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
            size="sm"
            icon="lucide:square-check-big"
          />
          <div class="grid grid-cols-3 gap-5 items-center">
            <u-form-field label="ID">
              <u-input
                type="number"
                v-model="state.id"
                class="w-full"
              />
            </u-form-field>

            <u-form-field label="Tournament">
              <u-input
                :model-value="event.tournament"
                disabled
                class="w-full"
              />
            </u-form-field>

            <u-form-field label="Tours">
              <u-input-tags
                v-model="state.tours"
                class="w-full"
              />
            </u-form-field>

            <div class="col-span-3">
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
                      class="w-full"
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
                      class="w-full"
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
                      class="w-full"
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
                      placeholder="Enter end date"
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
                      placeholder="Enter ATP start date"
                    />
                    <date-picker
                      id="atp_end_date"
                      v-model="state.atp_end_date"
                      placeholder="Enter ATP end date"
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
                      placeholder="Enter WTA start date"
                    />
                    <date-picker
                      id="wta_end_date"
                      v-model="state.wta_end_date"
                      placeholder="Enter WTA end date"
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
                      placeholder="Enter Men start date"
                    />
                    <date-picker
                      id="men_end_date"
                      v-model="state.men_end_date"
                      placeholder="Enter Men end date"
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
                      placeholder="Enter Women start date"
                    />
                    <date-picker
                      id="women_end_date"
                      v-model="state.women_end_date"
                      placeholder="Enter Women end date"
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
              <div>{{ state.venues?.join(", ") }}</div>
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
                  <create-venue />
                </template>
              </u-select-menu>
            </u-form-field>

            <u-form-field label="Supervisors">
              <div>{{ state.supervisors?.join(", ") }}</div>
              <u-select-menu
                v-model="state.supervisors"
                :loading="supervisorStatus === 'pending'"
                :items="(supervisors as any).map((s: any)=> s.id) || []"
                multiple
                class="w-full"
                placeholder="Select supervisors"
                @update:open="
            () => {
              if ((supervisors as any).length) {
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
                      placeholder="Enter ATP Singles draw"
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
                      placeholder="Enter ATP Singles draw link"
                    />
                    <u-select
                      id="atp_draw_d"
                      v-model="state.atp_draw_d"
                      placeholder="Enter ATP Doubles draw"
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
                      placeholder="Enter ATP Doubles draw link"
                    />
                    <u-select
                      id="atp_draw_qs"
                      v-model="state.atp_draw_qs"
                      placeholder="Enter ATP Qualifying Singles draw"
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
                      placeholder="Enter ATP Qualifying Singles draw link"
                    />
                    <u-select
                      id="atp_draw_qd"
                      v-model="state.atp_draw_qd"
                      placeholder="Enter ATP Qualifying Doubles draw"
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
                      placeholder="Enter ATP Qualifying Doubles draw link"
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
                      placeholder="Enter WTA Singles draw"
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
                      placeholder="Enter WTA Singles draw link"
                    />
                    <u-select
                      id="wta_draw_d"
                      v-model="state.wta_draw_d"
                      placeholder="Enter WTA Doubles draw"
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
                      placeholder="Enter WTA Doubles draw link"
                    />
                    <u-select
                      id="wta_draw_qs"
                      v-model="state.wta_draw_qs"
                      placeholder="Enter WTA Qualifying Singles draw"
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
                      placeholder="Enter WTA Qualifying Singles draw link"
                    />
                    <u-select
                      id="wta_draw_qd"
                      v-model="state.wta_draw_qd"
                      placeholder="Enter WTA Qualifying Doubles draw"
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
                      placeholder="Enter WTA Qualifying Doubles draw link"
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
                      placeholder="Enter Men Singles draw"
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
                      placeholder="Enter Men Singles draw link"
                    />
                    <u-select
                      id="men_draw_d"
                      v-model="state.men_draw_d"
                      placeholder="Enter Men Doubles draw"
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
                      placeholder="Enter Men Doubles draw link"
                    />
                    <u-select
                      id="men_draw_qs"
                      v-model="state.men_draw_qs"
                      placeholder="Enter Men Qualifying Singles draw"
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
                      placeholder="Enter Men Qualifying Singles draw link"
                    />
                    <u-select
                      id="men_draw_qd"
                      v-model="state.men_draw_qd"
                      placeholder="Enter Men Qualifying Doubles draw"
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
                      placeholder="Enter Men Qualifying Doubles draw link"
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
                      placeholder="Enter Women Singles draw"
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
                      placeholder="Enter Women Singles draw link"
                    />
                    <u-select
                      id="women_draw_d"
                      v-model="state.women_draw_d"
                      placeholder="Enter Women Doubles draw"
                      :items="drawOptions"
                    >
                      <template #content-bottom>
                        <u-button
                          @click="state.women_draw_d = undefined"
                          label="Clear"
                        />
                      </template>
                    </u-select>
                    <u-textarea
                      v-model="state.women_draw_d_link"
                      placeholder="Enter Women Doubles draw link"
                    />
                    <u-select
                      id="women_draw_qs"
                      v-model="state.women_draw_qs"
                      placeholder="Enter Women Qualifying Singles draw"
                      :items="drawOptions"
                    >
                      <template #content-bottom>
                        <u-button @click="state.women_draw_qs = undefined">Clear</u-button>
                      </template>
                    </u-select>
                    <u-textarea
                      v-model="state.women_draw_qs_link"
                      placeholder="Enter Women Qualifying Singles draw link"
                    />
                    <u-select
                      id="women_draw_qd"
                      v-model="state.women_draw_qd"
                      placeholder="Enter Women Qualifying Doubles draw"
                      :items="drawOptions"
                    >
                      <template #content-bottom>
                        <u-button @click="state.women_draw_qd = undefined">Clear</u-button>
                      </template>
                    </u-select>
                    <u-textarea
                      v-model="state.women_draw_qd_link"
                      placeholder="Enter Women Qualifying Doubles draw link"
                    />
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
