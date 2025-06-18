<script setup lang="ts">
defineProps<{ player: Omit<PlayerType, "tour"> }>()
</script>

<template>
  <div class="flex items-center gap-2">
    <u-link
      :to="{ name: 'country', params: { id: player.country.id, name: encodeName(player.country.name) } }"
      class="flex items-center"
    >
      <u-icon
        :name="getFlagCode(player.country)"
        class="text-xl"
      />
    </u-link>
    <u-link
      :to="{ name: 'player', params: { id: player.id, name: encodeName(player.name) } }"
      class="hover-link"
    >
      {{ player.name }}
    </u-link>
  </div>
</template>
