<script setup lang="ts">
definePageMeta({ name: "supervisors" })
useHead({ title: "Supervisors", templateParams: { subPage: null } })
const toast = useToast()

interface SupervisorsAPIResponse {
  count: number
  supervisors: { id: string; first_name: string; last_name: string }[]
}

const selectedLetter = ref<string>("All")
const page = ref(1)
const pageSize = ref(25)

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
const { data, status } = await useFetch<SupervisorsAPIResponse>("/api/all-supervisors", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * pageSize.value), limit: pageSize },
  onResponseError: () => {
    toast.add({
      title: "Error fetching supervisors",
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", icon: ICONS.supervisor }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #right>
        <set-page-size v-model="pageSize" />
      </template>

      <template #toolbar>
        <letters-radio-group
          v-model="selectedLetter"
          @update:modelValue="page = 1"
        />
      </template>

      <u-page-grid
        v-if="data && data.count > 0"
        class="mt-10"
      >
        <u-page-card
          v-for="supervisor in data.supervisors"
          :key="supervisor.id"
          :title="supervisor.first_name + ' ' + supervisor.last_name"
          :to="{ name: 'supervisor', params: { id: encodeName(supervisor.first_name + ' ' + supervisor.last_name) } }"
          highlight
          :ui="{ container: 'justify-center items-center text-center' }"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noSupervisor"
        title="No supervisors found"
        :status
      />

      <pagination-component
        v-if="data && data.count > 0"
        v-model="page"
        :total="data.count"
        :page-size="pageSize"
      />
    </nuxt-layout>
  </div>
</template>
