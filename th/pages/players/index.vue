<script setup lang="ts">
definePageMeta({ name: "players" })
useHead({ title: "Players" })
const toast = useToast()

const breakpoints = useBreakpoints(breakpointsTailwind)
const xlAndUp = breakpoints.greaterOrEqual("xl")

const selectedLetter = ref<string | null>(null)
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
const { data: players } = await useFetch<{ count: { low: number; high: number }; players: Pick<PlayerType, "id" | "name" | "country">[] }>("/api/allPlayers", {
  query: { letter: selectedLetter, skip: computed(() => (page.value - 1) * 24) },
  onResponseError: () => {
    toast.add({
      title: "Error fetching players",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-page>
    <u-page-header title="Players" />

    <u-page-body>
      <u-container class="flex justify-center">
        <u-radio-group
          v-model="selectedLetter"
          :items="variables.LETTERS"
          orientation="horizontal"
          class="my-5"
          @update:model-value="page = 1"
          color="secondary"
          :size="xlAndUp ? 'md' : 'sm'"
        >
          <template #legend>
            <div class="hidden lg:flex">
              Use
              <u-kbd value="meta" />
              <u-kbd value="shift" />
              <u-kbd value="letter" />
              to select a letter
            </div>
          </template>
        </u-radio-group>
      </u-container>

      <u-container
        v-if="players && players.players.length > 0"
        class="flex flex-col items-center gap-10"
      >
        <u-page-grid class="w-full">
          <u-page-card
            v-for="player in players.players"
            :key="player.id"
            :title="player.name"
            :to="{ name: 'player', params: { id: player.id, name: useChangeCase(player.name, 'kebabCase').value } }"
            :icon="`flag:${player.country.alpha2}-4x3`"
            highlight
            :ui="{ container: 'justify-center items-center text-center' }"
            orientation="horizontal"
            prefetch-on="interaction"
          >
            <nuxt-img
              :src="`https://www.atptour.com/-/media/alias/player-headshot/${player.id}`"
              alt="Player image"
              class="rounded-full border border-slate-500"
            />
          </u-page-card>
        </u-page-grid>

        <u-pagination
          v-model:page="page"
          :total="players.count.low"
          :items-per-page="24"
          color="secondary"
          variant="subtle"
          active-color="secondary"
          active-variant="solid"
        />
      </u-container>

      <error-message
        v-else
        :icon="ICONS['no-people']"
        title="No players found"
      />
    </u-page-body>
  </u-page>
</template>
