<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { parseDate } from "@internationalized/date"
import * as z from "zod"

useHead({ title: "Edit Player - TH Admin" })

const { query } = useRoute()
const toast = useToast()
const searchCoach = ref("")

const { data: player, status } = await useFetch<any>("/api/get-player", {
  query: { id: query.id }
})

const {
  data: coaches,
  status: coachStatus,
  execute: executeCoaches,
  refresh: refreshCoaches
} = await useFetch("/api/search-coaches", {
  default: () => [],
  immediate: false,
  query: { search: searchCoach }
})

type Schema = z.output<typeof playerSchema>

const state = reactive<Partial<Schema>>({
  id: query.id as string,
  first_name: player.value?.first_name,
  last_name: player.value?.last_name,
  tours: player.value?.tours,
  country: player.value?.country?.id,
  previous_countries: player.value?.previous_countries?.map((c: any) => c.id),
  turned_pro: player.value?.turned_pro,
  retired: player.value?.retired,
  coaches: player.value?.coaches?.map((c: any) => c.id),
  former_coaches: player.value?.former_coaches?.map((c: any) => c.id),
  atp_link: player.value?.atp_link,
  wta_link: player.value?.wta_link,
  wiki_link: player.value?.wiki_link,
  official_link: player.value?.official_link,
  bh: player.value?.bh,
  rh: player.value?.rh,
  current_singles: player.value?.current_singles,
  current_doubles: player.value?.current_doubles,
  ch_singles: player.value?.ch_singles,
  ch_doubles: player.value?.ch_doubles,
  singles_ch_date: player.value?.singles_ch_date ? parseDate(player.value?.singles_ch_date) : undefined,
  doubles_ch_date: player.value?.doubles_ch_date ? parseDate(player.value?.doubles_ch_date) : undefined,
  dob: player.value?.dob ? parseDate(player.value?.dob) : undefined,
  dod: player.value?.dod ? parseDate(player.value?.dod) : undefined,
  height: player.value?.height,
  pm: player.value?.pm,
  hof: player.value?.hof
})

const onOpenCoaches = () => {
  if (coaches.value.length) {
    set(searchCoach, "")
    refreshCoaches()
  } else {
    executeCoaches()
  }
}

const handleScrape = async () => {
  if (isNaN(Number(query.id))) {
    try {
      const response: any = await $fetch("http://127.0.0.1:5000/atp_player/" + query.id, {
        method: "GET",
        timeout: 120_000
      })
      if (response.ok) {
        toast.add({
          title: "Player updated",
          icon: "lucide:circle-check",
          color: "success"
        })
      } else {
        toast.add({
          title: "Error updating player",
          icon: "lucide:circle-x",
          color: "error"
        })
      }
    } catch (e) {
      console.error(e)
      toast.add({
        title: "Error updating player",
        icon: "lucide:circle-x",
        color: "error"
      })
    } finally {
      reloadNuxtApp()
    }
  } else {
    try {
      const response: any = await $fetch("http://127.0.0.1:5000/wta_player/" + query.id, {
        method: "GET",
        timeout: 120_000
      })
      if (response.ok) {
        toast.add({
          title: "Player updated",
          icon: "lucide:circle-check",
          color: "success"
        })
      } else {
        toast.add({
          title: "Error updating player",
          icon: "lucide:circle-x",
          color: "error"
        })
      }
    } catch (e) {
      console.error(e)
      toast.add({
        title: "Error updating player",
        icon: "lucide:circle-x",
        color: "error"
      })
    } finally {
      reloadNuxtApp()
    }
  }
}

const handleUpdate = async () => {
  if (isNaN(Number(query.id))) {
    try {
      const response: any = await $fetch("http://127.0.0.1:5000/update_atp_player/" + query.id, {
        method: "GET",
        timeout: 120_000
      })
      if (response.ok) {
        toast.add({
          title: "Player updated",
          icon: "lucide:circle-check",
          color: "success"
        })
      } else {
        toast.add({
          title: "Error updating player",
          icon: "lucide:circle-x",
          color: "error"
        })
      }
    } catch (e) {
      console.error(e)
      toast.add({
        title: "Error updating player",
        icon: "lucide:circle-x",
        color: "error"
      })
    } finally {
      reloadNuxtApp()
    }
  } else {
    try {
      await $fetch("http://127.0.0.1:5000/update_wta_player/" + query.id, {
        method: "GET",
        timeout: 120_000
      })
    } catch (e) {
      console.error(e)
    } finally {
      reloadNuxtApp()
    }
  }
}

const onSubmit = async (e: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-player", {
      query: e.data
    })
    toast.add({
      title: "Player updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating player",
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
        <u-dashboard-navbar :title="`Edit Player - ${player.first_name ? `${player.first_name} ${player.last_name}` : query.id}`" />
        <u-dashboard-toolbar>
          <u-button
            label="Scrape player"
            @click="handleScrape"
            size="sm"
            block
          />
          <div
            v-if="player?.updated_at"
            class="text-sm min-w-xs flex justify-center items-center"
          >
            Updated at: {{ useDateFormat(player.updated_at, "DD MMMM YYYY") }}
          </div>
          <u-button
            label="Update Player"
            @click="handleUpdate"
            block
            size="sm"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-form
          :schema="playerSchema"
          :state
          @submit="onSubmit"
        >
          <u-button
            type="submit"
            label="Save"
            size="sm"
            block
            class="mb-3"
          />
          <div class="grid grid-cols-3 gap-2">
            <div
              v-if="['pending', 'idle'].includes(status)"
              class="my-5"
            >
              Loading...
            </div>
            <template v-else>
              <u-form-field
                name="first_name"
                label="First name"
              >
                <u-input
                  v-model="state.first_name"
                  placeholder="First Name"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="last_name"
                label="Last name"
              >
                <u-input
                  v-model="state.last_name"
                  placeholder="Last Name"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="tours"
                label="Tours"
              >
                <u-input-tags
                  v-model="state.tours"
                  placeholder="Enter tour"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="country"
                label="Country"
              >
                <u-input
                  v-model="state.country"
                  placeholder="Country code"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="previous_countries"
                label="Previous countries"
              >
                <u-input-tags
                  v-model="state.previous_countries"
                  placeholder="Enter previous countries' codes"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="turned_pro"
                label="Turned pro"
              >
                <u-input
                  type="number"
                  v-model="state.turned_pro"
                  placeholder="Turned pro"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="retired"
                label="Retired"
              >
                <u-input
                  type="number"
                  v-model="state.retired"
                  placeholder="Retired"
                  class="w-full"
                />
              </u-form-field>

              <u-form-field
                name="plays"
                label="Plays"
              >
                <u-select
                  v-model="state.rh"
                  placeholder="Select handedness"
                  class="w-full"
                  :items="[
                    { value: true, label: 'Right' },
                    { value: false, label: 'Left' }
                  ]"
                >
                  <template #content-bottom>
                    <u-button
                      size="sm"
                      label="Clear"
                      @click="state.rh = undefined"
                    />
                  </template>
                </u-select>
              </u-form-field>

              <u-form-field
                name="bh"
                label="Backhand"
              >
                <u-select
                  v-model="state.bh"
                  :items="['One', 'Two']"
                  placeholder="Select backhand"
                  class="w-full"
                >
                  <template #content-bottom>
                    <u-button
                      size="sm"
                      label="Clear"
                      @click="state.bh = undefined"
                    />
                  </template>
                </u-select>
              </u-form-field>

              <u-form-field
                name="dob"
                label="Date of Birth"
              >
                <date-picker
                  v-model="state.dob"
                  placeholder="Select date of birth"
                />
              </u-form-field>
              <u-form-field
                name="dod"
                label="Date of Death"
              >
                <date-picker
                  v-model="state.dod"
                  placeholder="Select date of death"
                />
              </u-form-field>
              <u-form-field
                name="height"
                label="Height (cm)"
              >
                <u-input-number
                  v-model="state.height"
                  placeholder="Height"
                  orientation="vertical"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="pm"
                label="Prize Money"
              >
                <u-input-number
                  v-model="state.pm"
                  placeholder="Prize Money"
                  orientation="vertical"
                  class="w-full"
                  :format-options="{
                    style: 'currency',
                    currency: 'USD'
                  }"
                />
              </u-form-field>
              <div class="col-span-2">
                <u-form-field
                  name="ranks"
                  label="Ranks"
                >
                  <div class="grid grid-cols-4 gap-2">
                    <div class="flex justify-center items-center">
                      <u-badge
                        label="Singles"
                        color="Singles"
                      />
                    </div>
                    <u-input-number
                      placeholder="Current"
                      v-model="state.current_singles"
                      orientation="vertical"
                      class="w-full"
                    />
                    <u-input-number
                      placeholder="Career high"
                      v-model="state.ch_singles"
                      orientation="vertical"
                      class="w-full"
                    />
                    <date-picker
                      v-model="state.singles_ch_date"
                      placeholder="Select date"
                    />
                    <div class="flex justify-center items-center">
                      <u-badge
                        label="Doubles"
                        color="Doubles"
                      />
                    </div>
                    <u-input-number
                      placeholder="Current"
                      v-model="state.current_doubles"
                      orientation="vertical"
                      class="w-full"
                    />
                    <u-input-number
                      placeholder="Career high"
                      v-model="state.ch_doubles"
                      orientation="vertical"
                      class="w-full"
                    />
                    <date-picker
                      v-model="state.doubles_ch_date"
                      placeholder="Select date"
                    />
                  </div>
                </u-form-field>
              </div>

              <u-form-field
                name="hof"
                label="Hall of Fame Induction"
              >
                <u-input
                  type="number"
                  v-model="state.hof"
                  placeholder="Hall of Fame Induction"
                  class="w-full"
                />
              </u-form-field>
              <u-form-field
                name="coaches"
                label="Coaches"
              >
                <div>{{ state.coaches?.join(", ") }}</div>
                <u-select-menu
                  v-model="state.coaches"
                  :loading="coachStatus === 'pending'"
                  :items="coaches || []"
                  multiple
                  class="w-full"
                  placeholder="Select coaches"
                  @update:open="onOpenCoaches"
                >
                  <template #content-bottom>
                    <create-person type="Coach" />
                  </template>
                </u-select-menu>
              </u-form-field>

              <u-form-field
                name="former_coaches"
                label="Former coaches"
              >
                <div>{{ state.former_coaches?.join(", ") }}</div>
                <u-select-menu
                  v-model="state.former_coaches"
                  :loading="coachStatus === 'pending'"
                  :items="coaches || []"
                  multiple
                  class="w-full"
                  placeholder="Select coaches"
                  @update:open="onOpenCoaches"
                >
                  <template #content-bottom>
                    <create-person type="Coach" />
                  </template>
                </u-select-menu>
              </u-form-field>

              <div class="col-span-3">
                <u-form-field
                  name="links"
                  label="Links"
                >
                  <div class="grid grid-cols-4 gap-2 *:flex *:flex-col *:gap-1">
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
                      />
                    </div>
                    <div>
                      <label for="wiki_link">
                        <u-badge label="Wiki" />
                      </label>
                      <u-textarea
                        id="wiki_link"
                        v-model="state.wiki_link"
                      />
                    </div>
                    <div>
                      <label for="official_link">
                        <u-badge
                          label="Official"
                          color="success"
                        />
                      </label>
                      <u-textarea
                        id="official_link"
                        v-model="state.official_link"
                      />
                    </div>
                  </div>
                </u-form-field>
              </div>
            </template>
          </div>
        </u-form>
      </template>
    </u-dashboard-panel>
  </div>
</template>
