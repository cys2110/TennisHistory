<script setup lang="ts">
definePageMeta({ name: "draws" })

const {
  params: { id }
} = useRoute("event")
useHead({ title: () => `${id} Draws - TH Admin` })
const {
  ui: { icons }
} = useAppConfig()

const selectedTour = ref<string>("ATP")
const selectedType = ref<string>("Singles")
const selectedDraw = ref<string>("Main")
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Matches - ${id}`">
          <template #leading>
            <u-dashboard-sidebar-collapse variant="link" />
          </template>
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-radio-group
            legend="Tour Type"
            v-model="selectedTour"
            :items="['ATP', 'WTA', 'Men', 'Women']"
            orientation="horizontal"
          />
          <u-radio-group
            legend="Match Type"
            v-model="selectedType"
            :items="['Singles', 'Doubles']"
            orientation="horizontal"
          />
          <u-radio-group
            legend="Draw Type"
            v-model="selectedDraw"
            :items="['Main', 'Qualifying']"
            orientation="horizontal"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <!-- <draws-country v-if="data?.draw_type" /> -->
        <!-- <draws-rr v-else-if="data?.[selectedTour]?.[selectedType] === 'Round Robin'" /> -->
        <draws-regular
          v-model="selectedTour"
          v-model:type="selectedType"
          v-model:draw="selectedDraw"
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
