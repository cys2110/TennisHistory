<script setup lang="ts">
definePageMeta({ name: "players", layout: false })
useHead({ title: "Players", templateParams: { subPage: null } })
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

interface PlayerAPIResponse {
  count: number
  players: Pick<PlayerInterface, "id" | "name" | "country" | "active_years">[]
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
const { data } = await useFetch<PlayerAPIResponse>("/api/all-players", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 25) },
  onResponseError: () => {
    toast.add({
      title: "Error fetching players",
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #leading-icon>
        <u-icon
          :name="ICONS.people"
          class="text-xl"
        />
      </template>
      <template #title>Players</template>
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
          v-for="player in data.players"
          :key="player.id"
          :title="player.name"
          :description="player.active_years || ''"
          :to="{ name: 'player', params: { name: useChangeCase(player.name, 'kebabCase').value, id: player.id } }"
          :icon="`flag:${player.country.alpha2}-4x3`"
          highlight
          :ui="{ body: 'max-h-70', container: 'lg:flex items-center text-center' }"
          orientation="vertical"
          reverse
        >
          <nuxt-img
            :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
            :alt="player.name"
            class="rounded-full border border-neutral-500 max-h-40"
          />
        </u-page-card>
      </u-page-grid>
      <error-message
        v-else
        :icon="ICONS['no-people']"
        title="No players found"
      />
      <pagination
        v-if="data && data.count > 0"
        v-model="page"
        :total="data.count"
        class="mx-auto mt-auto"
        :size="mdAndUp ? 'lg' : 'xs'"
      />
    </nuxt-layout>
  </div>
</template>
