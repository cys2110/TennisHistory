<script setup>
definePageMeta({ name: "rounds" })

const {
  params: { id }
} = useRoute("rounds")
useHead({ title: () => `${id} Rounds - TH Admin` })
const addRounds = ref([])
const {
  ui: { icons }
} = useAppConfig()

const {
  data: rounds,
  status,
  refresh
} = await useFetch("/api/rounds/get", {
  query: { id },
  default: () => []
})

function handleAddRound() {
  addRounds.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Rounds - ${id}`">
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Add Round"
            @click="handleAddRound"
            block
            :icon="icons.plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <rounds-add
          v-for="n in addRounds"
          :key="`add-round-${n}`"
          :refresh
        />
        <rounds-edit
          v-if="rounds.length"
          v-for="(round, index) in rounds"
          :key="`round-${index}`"
          :round="round"
        />
        <loading v-else-if="status === 'pending'" />
        <reload
          v-else
          message="rounds"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
