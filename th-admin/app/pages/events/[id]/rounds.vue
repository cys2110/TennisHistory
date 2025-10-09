<script setup>
definePageMeta({ name: "rounds" })

const {
  params: { id }
} = useRoute("rounds")
useHead({ title: () => `${id} Rounds - TH Admin` })
const addRounds = ref([])

const { data: rounds, status } = await useFetch("/api/rounds/get", {
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
        <u-dashboard-navbar :title="`Rounds - ${id}`" />
        <u-dashboard-toolbar>
          <u-button
            label="Add Round"
            @click="handleAddRound"
            class="w-full"
            size="sm"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <client-only>
          <rounds-add
            v-for="n in addRounds"
            :key="`add-round-${n}`"
          />
        </client-only>
        <rounds-edit
          v-if="rounds.length"
          v-for="(round, index) in rounds"
          :key="`round-${index}`"
          :round="round"
        />
        <div v-else-if="status === 'pending'">Loading...</div>
        <div class="flex flex-col gap-2">
          <div>No rounds found.</div>
          <u-button
            label="Refresh"
            @click="() => reloadNuxtApp()"
          />
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
