<script setup>
definePageMeta({ name: "walkovers" })

const {
  params: { id }
} = useRoute("walkovers")
useHead({ title: () => `${id} Walkovers - TH Admin` })
const addWalkovers = ref([])
const {
  ui: { icons }
} = useAppConfig()

const {
  data: entries,
  status,
  refresh
} = await useFetch("/api/retirements/get", {
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
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Add Walkover"
            @click="handleAddWalkover"
            block
            :icon="icons.plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <retirements-add
            v-for="n in addWalkovers"
            :key="`add-walkover-${n}`"
            type="Walkover"
            :refresh
          />
          <retirements-edit
            v-if="entries.length"
            v-for="(entry, index) in entries"
            :key="`walkover-${index}`"
            :entry
            type="Walkover"
          />
          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="entries"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
