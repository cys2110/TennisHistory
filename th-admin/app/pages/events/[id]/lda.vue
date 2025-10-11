<script setup>
definePageMeta({ name: "lda" })

const {
  params: { id }
} = useRoute("rounds")
useHead({ title: () => `${id} LDA - TH Admin` })
const addLdas = ref([])
const {
  ui: { icons }
} = useAppConfig()

const {
  data: entries,
  status,
  refresh
} = await useFetch("/api/lda/get", {
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
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Add LDA"
            @click="handleAddLda"
            block
            :icon="icons.plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <lda-add
            v-for="n in addLdas"
            :key="`add-lda-${n}`"
            :refresh
          />
          <lda-edit
            v-if="entries.length"
            v-for="(entry, index) in entries"
            :key="`lda-${index}`"
            :entry
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
