<script setup>
definePageMeta({ name: "lda" })

const {
  params: { id }
} = useRoute("rounds")
useHead({ title: () => `${id} LDA - TH Admin` })
const addLdas = ref([])

const { data: entries, status } = await useFetch("/api/lda/get", {
  query: { id },
  default: () => []
})

function handleAddLda() {
  addLdas.value.push(Date.now()) // ensures unique key
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`LDA - ${id}`">
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
            label="Add LDA"
            @click="handleAddLda"
            block
            size="sm"
            icon="lucide:square-plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <client-only>
          <lda-add
            v-for="n in addLdas"
            :key="`add-lda-${n}`"
          />
        </client-only>
        <lda-edit
          v-if="entries.length"
          v-for="(entry, index) in entries"
          :key="`lda-${index}`"
          :entry
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
