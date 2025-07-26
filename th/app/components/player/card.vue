<script setup lang="ts">
const { player } = defineProps<{
  player: PlayerInterface
}>()
const currentYear = new Date().getFullYear()
</script>

<template>
  <u-page-card
    :title="`${player.first_name} ${player.last_name}`"
    :to="{ name: 'player', params: { id: player.id, name: kebabCase(`${player.first_name} ${player.last_name}`) } }"
    highlight
    :highlight-color="getTourColor([player.tour])"
    :ui="{
      leading: 'justify-between w-full',
      body: 'w-full text-center'
    }"
  >
    <template #leading>
      <u-icon
        :name="getFlagCode(player.country)"
        class="text-2xl"
      />
      <div class="flex items-center gap-2">
        <u-badge
          :color="getTourColor([player.tour])"
          :label="player.tour"
        />
        <u-badge
          :color="player.max_year === currentYear ? 'active' : 'inactive'"
          :label="player.max_year === currentYear ? 'Active' : 'Inactive'"
        />
      </div>
    </template>

    <template #description>
      <slot name="description" />
      <template v-if="!$slots.description">
        {{
          player.min_year && player.min_year === player.max_year ? player.min_year
          : player.min_year && player.max_year === currentYear ? `${player.min_year} - present`
          : player.min_year ? `${player.min_year} - ${player.max_year}`
          : "—"
        }}
      </template>
    </template>
  </u-page-card>
</template>
