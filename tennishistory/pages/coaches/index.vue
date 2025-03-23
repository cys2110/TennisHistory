<script setup lang="ts">
definePageMeta({ name: "coaches", layout: "dashboard-layout" })
useHead({ title: "Coaches", templateParams: { subPage: null } })
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

interface CoachesAPIResponse {
  count: number
  coaches: {
    labels: string[]
    id: string
    name: string
    country: CountryInterface | null
  }[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)

// Set shortcuts for radio group
defineShortcuts({
  meta_shift_a: () => (selectedLetter.value = "A"),
  meta_shift_b: () => (selectedLetter.value = "B"),
  meta_shift_c: () => (selectedLetter.value = "C"),
  meta_shift_d: () => (selectedLetter.value = "D"),
  meta_shift_e: () => (selectedLetter.value = "E"),
  meta_shift_f: () => (selectedLetter.value = "F"),
  meta_shift_g: () => (selectedLetter.value = "G"),
  meta_shift_h: () => (selectedLetter.value = "H"),
  meta_shift_i: () => (selectedLetter.value = "I"),
  meta_shift_j: () => (selectedLetter.value = "J"),
  meta_shift_k: () => (selectedLetter.value = "K"),
  meta_shift_l: () => (selectedLetter.value = "L"),
  meta_shift_m: () => (selectedLetter.value = "M"),
  meta_shift_n: () => (selectedLetter.value = "N"),
  meta_shift_o: () => (selectedLetter.value = "O"),
  meta_shift_p: () => (selectedLetter.value = "P"),
  meta_shift_q: () => (selectedLetter.value = "Q"),
  meta_shift_r: () => (selectedLetter.value = "R"),
  meta_shift_s: () => (selectedLetter.value = "S"),
  meta_shift_t: () => (selectedLetter.value = "T"),
  meta_shift_u: () => (selectedLetter.value = "U"),
  meta_shift_v: () => (selectedLetter.value = "V"),
  meta_shift_w: () => (selectedLetter.value = "W"),
  meta_shift_x: () => (selectedLetter.value = "X"),
  meta_shift_y: () => (selectedLetter.value = "Y"),
  meta_shift_z: () => (selectedLetter.value = "Z")
})

// API call
const { data } = await useFetch<CoachesAPIResponse>("/api/all-coaches", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25) },
  onResponseError: () => {
    toast.add({
      title: "Error fetching coaches",
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel class="max-h-screen">
      <template #header>
        <u-dashboard-navbar title="Coaches">
          <template #leading>
            <u-dashboard-sidebar-collapse />
            <u-icon :name="ICONS.coach" />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar :ui="{ root: 'w-full flex justify-center' }">
          <letters-radio-group
            v-model="selectedLetter"
            @update:modelValue="page = 1"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-grid
          v-if="data && data.count > 0"
          class="mt-10"
        >
          <u-page-card
            v-for="coach in data.coaches"
            :key="coach.id"
            :title="coach.labels.includes('Player') ? coach.name : coach.id"
            :to="{ name: 'coach', params: { id: useChangeCase(coach.labels.includes('Player') ? coach.name : coach.id, 'kebabCase').value } }"
            highlight
            prefetch-on="interaction"
            :ui="{ container: 'justify-center items-center text-center', wrapper: 'flex flex-row items-center gap-2', leading: 'mb-0 gap-2' }"
          >
            <template
              #leading
              v-if="coach.labels.includes('Player')"
            >
              <u-icon :name="`flag:${coach.country?.alpha2}-4x3`" />
              <u-avatar
                :src="`https://www.atptour.com/-/media/alias/player-headshot/${coach.id}`"
                :alt="coach.name"
                class="border border-neutral-500"
              />
            </template>
          </u-page-card>
        </u-page-grid>
        <error-message
          v-else
          :icon="ICONS['no-info']"
          title="No coaches found"
        />
        <pagination
          v-if="data && data.count > 0"
          v-model="page"
          :total="data.count"
          class="mx-auto mt-auto"
          :size="mdAndUp ? 'lg' : 'xs'"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
