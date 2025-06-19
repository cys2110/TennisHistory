<script setup lang="ts">
defineProps<{ seed: SeedType | SeedType[]; qualifying?: boolean }>()
</script>

<template>
  <u-page-card
    highlight
    :highlight-color="getTourColours([Array.isArray(seed) ? seed[0].tour : seed.tour]).cardColour"
    :ui="{
      container: 'flex-row lg:flex lg:flex-row',
      wrapper: 'flex-1 order-last',
      root: 'h-full',
      description: 'text-xs',
      body: 'w-full'
    }"
  >
    <template #leading>
      <u-badge class="rounded-full size-5 mr-4 justify-center items-center"
        >{{ qualifying ? "Q" : "" }}{{ Array.isArray(seed) ? seed[0].seed : seed.seed }}</u-badge
      >
      <country-link
        v-if="!Array.isArray(seed)"
        :country="seed.country"
        icon-only
      />
      <div
        v-else
        class="flex items-center gap-1"
      >
        <country-link
          :country="seed[0].country"
          icon-only
        />
        /
        <country-link
          :country="seed[1].country"
          icon-only
        />
      </div>
    </template>

    <template #title>
      <u-link
        v-if="!Array.isArray(seed)"
        class="hover-link w-fit"
        :class="{ 'line-through': seed.withdrew }"
        :to="{ name: 'player', params: { id: seed.id, name: encodeName(seed.name) } }"
      >
        {{ seed.name }}
      </u-link>
      <div
        v-else
        class="flex flex-wrap items-center gap-1"
      >
        <u-link
          class="hover-link w-fit"
          :class="{ 'line-through': seed[0].withdrew }"
          :to="{ name: 'player', params: { id: seed[0].id, name: encodeName(seed[0].name) } }"
        >
          {{ seed[0].name }}
        </u-link>
        /
        <u-link
          class="hover-link w-fit"
          :class="{ 'line-through': seed[1].withdrew }"
          :to="{ name: 'player', params: { id: seed[1].id, name: encodeName(seed[1].name) } }"
        >
          {{ seed[1].name }}
        </u-link>
      </div>
    </template>

    <template #description>
      <div class="flex items-center justify-between">
        <span>Rank (draw)</span>
        <span class="font-semibold">{{ Array.isArray(seed) ? seed[0].rank2 : seed.rank2 }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>Rank (start date)</span>
        <span class="font-semibold">{{ Array.isArray(seed) ? `${seed[0].rank} / ${seed[1].rank}` : seed.rank }}</span>
      </div>
    </template>
  </u-page-card>
</template>
