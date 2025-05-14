<script setup lang="ts">
defineProps<{ seeds: SeedType[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid v-if="seeds.length || ['pending', 'idle'].includes(status)">
    <u-page-card
      v-if="seeds.length"
      v-for="seed in seeds"
      :key="seed.id"
      orientation="horizontal"
      reverse
      :ui="{
        container: 'flex-row lg:flex lg:flex-row',
        wrapper: 'flex-1 order-last',
        root: 'h-full',
        description: 'text-xs',
        body: 'w-full'
      }"
    >
      <template #leading>
        <u-badge
          variant="outline"
          class="rounded-full h-5 w-5 mr-4 justify-center items-center"
          color="secondary"
        >
          {{ seed.seed }}
        </u-badge>
        <base-link
          type="country"
          :country="seed.country"
        />
      </template>

      <template #title>
        <u-link
          class="hover-link w-fit"
          :class="{ 'line-through': seed.withdrew }"
          :to="{ name: 'player', params: { id: seed.id, name: encodeName(seed.name) } }"
        >
          {{ seed.name }}
        </u-link>
      </template>

      <template #description>
        <div class="flex items-center justify-between">
          <span>Rank (draw)</span>
          <span class="font-semibold">{{ seed.rank2 }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Rank (start date)</span>
          <span class="font-semibold">{{ seed.rank }}</span>
        </div>
      </template>

      <u-avatar
        :src="`https://www.atptour.com/-/media/alias/player-headshot/${seed.id}`"
        :alt="seed.name"
        :icon="ICONS.player"
        size="3xl"
      />
    </u-page-card>

    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :message="`No seeds found for ${name} ${route.params.year}`"
  />
</template>
