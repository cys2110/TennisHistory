<script setup lang="ts">
defineProps<{ checked: boolean }>()
</script>

<template>
  <tournament-historical-pm
    id="historical-pm"
    :checked
  />
  <div
    class="grid gap-10"
    :class="checked ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'"
  >
    <tournament-finalists
      id="finalists"
      :checked
    />
    <tournament-country-winners
      id="country-winners"
      :checked
    />
    <winners-by-age
      id="winners-by-age"
      :checked
    />
  </div>
  <games-sets-lost
    id="games-sets-lost"
    :checked
  />
</template>
