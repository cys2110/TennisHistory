<script setup lang="ts">
useHead({ title: "Surfaces" })
useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Surfaces",
  description: "A collection of tennis court surfaces"
}))
</script>

<template>
  <u-container class="max-w-(--container-6xl)">
    <u-page>
      <u-page-header title="Surfaces" />

      <u-page-body>
        <u-page-grid>
          <u-page-card
            v-for="surface in SURFACES_LIST"
            :key="surface.id"
            highlight
            :to="{ name: 'surface', params: { id: kebabCase(surface.id) } }"
            :ui="{ title: 'flex justify-center items-center gap-2', body: 'w-full' }"
          >
            <template #title>
              <u-avatar
                :src="`/surfaces/${surface.surface}.jpg`"
                :alt="surface.id"
              />
              <span>{{ surface.id }}</span>
            </template>
          </u-page-card>
        </u-page-grid>
      </u-page-body>
    </u-page>
  </u-container>
</template>
