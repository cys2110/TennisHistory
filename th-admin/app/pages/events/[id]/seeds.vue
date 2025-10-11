<script setup>
definePageMeta({ name: "seeds" })

const {
  params: { id }
} = useRoute("seeds")
useHead({ title: () => `${id} Seeds - TH Admin` })
const {
  ui: { icons }
} = useAppConfig()

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
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <seeds-edit
            v-if="seeds.length"
            v-for="(seed, index) in seeds"
            :key="`seed-${index}`"
            :seed
          />
          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="seeds"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
