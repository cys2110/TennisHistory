<script setup>
definePageMeta({ name: "seeds" })

const {
  params: { id }
} = useRoute("seeds")
useHead({ title: () => `${id} Seeds - TH Admin` })

const { data: seeds, status } = await useFetch("/api/seeds/get", {
  query: { id },
  default: () => []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Seeds - ${id}`">
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button
                icon="lucide:layers-3"
                size="sm"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <seeds-edit
          v-if="seeds.length"
          v-for="(seed, index) in seeds"
          :key="`seed-${index}`"
          :seed
        />
        <div v-else-if="status === 'pending'">Loading...</div>
        <div class="flex flex-col gap-2 items-center">
          <div>No seeds found.</div>
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
