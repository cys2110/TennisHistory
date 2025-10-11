<script setup>
definePageMeta({ name: "defaults" })

const {
  params: { id }
} = useRoute("defaults")
useHead({ title: () => `${id} Defaults - TH Admin` })
const addDefaults = ref([])
const {
  ui: { icons }
} = useAppConfig()

const {
  data: entries,
  status,
  refresh
} = await useFetch("/api/retirements/get", {
  query: { id, type: "DEFAULTED" },
  default: () => []
})

function handleAddDefault() {
  addDefaults.value.push(Date.now())
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Defaults - ${id}`">
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Add Default"
            @click="handleAddDefault"
            block
            :icon="icons.plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <retirements-add
            v-for="n in addDefaults"
            :key="`add-default-${n}`"
            type="Default"
            :refresh
          />
          <retirements-edit
            v-if="entries.length"
            v-for="(entry, index) in entries"
            :key="`default-${index}`"
            :entry
            type="Default"
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
