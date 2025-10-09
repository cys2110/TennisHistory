<script setup>
definePageMeta({ name: "retirements" })

const {
  params: { id }
} = useRoute("retirements")
useHead({ title: () => `${id} Retirements - TH Admin` })
const addRetirements = ref([])

const { data: entries, status } = await useFetch("/api/retirements/get", {
  query: { id, type: "RETIRED" },
  default: () => []
})

function handleAddRetirement() {
  addRetirements.value.push(Date.now())
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Retirements - ${id}`">
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
            label="Add Retirement"
            @click="handleAddRetirement"
            block
            size="sm"
            icon="lucide:square-plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <client-only>
          <retirements-add
            v-for="n in addRetirements"
            :key="`add-retirement-${n}`"
            type="Retirement"
          />
        </client-only>
        <retirements-edit
          v-if="entries.length"
          v-for="(entry, index) in entries"
          :key="`retirement-${index}`"
          :entry
          type="Retirement"
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
