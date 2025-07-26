<template>
  <u-page-grid class="xl:grid-cols-4 2xl:grid-cols-5">
    <u-page-card
      v-for="surface in SURFACES_LIST"
      :key="surface.id"
      :to="{ name: 'surface', params: { id: kebabCase(surface.id) } }"
      highlight
      highlight-color="joint"
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
</template>
