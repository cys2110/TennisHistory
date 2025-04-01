<script setup lang="ts">
definePageMeta({ name: "umpires" })
useHead({ title: "Umpires", templateParams: { subPage: null } })
const toast = useToast()

interface UmpiresAPIResponse {
  count: number
  umpires: string[]
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
const { data, status } = await useFetch<UmpiresAPIResponse>("/api/all-umpires", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25), limit: pageSize },
  onResponseError: () => {
    toast.add({
      title: "Error fetching umpires",
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Umpires", icon: ICONS.umpire }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="items" />
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
          v-for="umpire in data.umpires"
          :key="umpire"
          :title="umpire"
          :to="{ name: 'umpire', params: { id: encodeName(umpire) } }"
          highlight
          :ui="{ container: 'justify-center items-center text-center' }"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noPeople"
        title="No umpires found"
        :status
      />

      <ClientOnly>
        <pagination-component
          v-if="data && data.count > 0"
          v-model="page"
          :total="data.count"
          :page-size="pageSize"
        />
      </ClientOnly>
    </nuxt-layout>
  </div>
</template>
