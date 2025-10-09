<script setup>
definePageMeta({ name: "walkovers" })

const {
  params: { id }
} = useRoute("walkovers")
useHead({ title: () => `${id} Walkovers - TH Admin` })
const addWalkovers = ref([])

const { data: entries, status } = await useFetch("/api/retirements/get", {
  query: { id, type: "WALKOVER" },
  default: () => []
})

function handleAddWalkover() {
  addWalkovers.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Walkovers - ${id}`">
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
          <u-button
            label="Add Walkover"
            @click="handleAddWalkover"
            block
            size="sm"
            icon="lucide:square-plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <client-only>
          <retirements-add
            v-for="n in addWalkovers"
            :key="`add-walkover-${n}`"
            type="Walkover"
          />
        </client-only>
        <retirements-edit
          v-if="entries.length"
          v-for="(entry, index) in entries"
          :key="`walkover-${index}`"
          :entry
          type="Walkover"
        />
        <div v-else-if="status === 'pending'">Loading...</div>
        <div
          v-else
          class="flex flex-col gap-2 items-center"
        >
          <div>No entries found.</div>
          <u-button
            label="Refresh"
            @click="() => reloadNuxtApp()"
            icon="lucide:refresh-ccw"
          />
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
