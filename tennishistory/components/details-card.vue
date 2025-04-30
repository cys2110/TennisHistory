<script setup lang="ts">
defineProps<{
  detail: { id?: string; title: string; value: any; description?: string | undefined }
}>()
</script>

<template>
  <u-page-card
    :title="detail?.title"
    highlight
    :ui="{ footer: 'text-sm text-(--ui-text-dimmed) pt-2 pb-0 self-start mt-0 justify-start' }"
  >
    <template #description>
      <div v-if="detail.id === 'supervisors'">
        <base-link
          v-if="detail.value.length"
          v-for="supervisor in detail.value"
          :key="supervisor"
          :id="supervisor"
          :type="'supervisor'"
        />
        <template v-else>—</template>
      </div>
      <div v-else-if="detail.id === 'venues'">
        <div
          v-for="(venue, index) in detail.value"
          :key="index"
          class="flex flex-wrap gap-2 items-center"
        >
          <base-link
            :id="venue.id"
            type="venue"
          >
            {{ venue.name ? `${venue.name}, ${venue.city}` : `${venue.city}` }}
          </base-link>
          <country-link :country="venue.country" />
        </div>
      </div>
      <template v-else>{{ detail.value }}</template>
    </template>
    <template
      #footer
      v-if="detail?.description"
    >
      {{ detail.description }}
    </template>
  </u-page-card>
</template>
