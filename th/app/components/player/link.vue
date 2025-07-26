<script setup lang="ts">
defineProps<{ player: PlayerInterface }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <u-link
      :to="{ name: 'country', params: { name: kebabCase(player.country.name), id: player.country.id } }"
      class="flex items-center"
    >
      <u-icon
        :name="getFlagCode(player.country)"
        class="text-xl"
      />
    </u-link>
    <u-link
      :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } }"
      class="hover-link"
    >
      {{ player.first_name }} {{ player.last_name }}
    </u-link>
  </div>
</template>
