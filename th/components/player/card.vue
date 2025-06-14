<script setup lang="ts">
const { player } = defineProps<{
  player: Pick<PlayerInterface, "id" | "name" | "country" | "min_year" | "max_year" | "tour">
}>()
const currentYear = new Date().getFullYear()
const highlightColor = computed(() => player.tour.toLowerCase() as "atp" | "wta")
</script>

<template>
  <u-page-card
    :title="player.name"
    :to="{ name: 'player', params: { id: player.id, name: encodeName(player.name) } }"
    highlight
    :highlight-color
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
      <u-badge
        variant="outline"
        :color="player.max_year === currentYear ? 'active' : 'inactive'"
        :label="player.max_year === currentYear ? 'Active' : 'Inactive'"
      />
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
