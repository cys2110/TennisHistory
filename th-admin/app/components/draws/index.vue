<script setup lang="ts">
const {
  params: { eid }
} = useRoute("draws")
const selectedTour = ref<string>("ATP")
const selectedType = ref<string>("Singles")
const selectedDraw = ref<string>("Main")
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
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
    </div>
    <!-- <draws-country v-if="data?.draw_type" /> -->
    <!-- <draws-rr v-else-if="data?.[selectedTour]?.[selectedType] === 'Round Robin'" /> -->
    <draws-regular
      v-model="selectedTour"
      v-model:type="selectedType"
      v-model:draw="selectedDraw"
    />
  </div>
</template>
