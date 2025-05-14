<script setup lang="ts">
const { awards } = defineProps<{ awards: RoundInterface[]; status: APIStatusType }>()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
</script>

<template>
  <u-page-grid v-if="awards.length || ['pending', 'idle'].includes(status)">
    <u-page-card
      v-if="awards.length"
      v-for="award in awards"
      :key="award.round"
      :title="award.round"
      :ui="{ body: 'w-full' }"
    >
      <template #description>
        <div class="flex items-center justify-between">
          <span>Prize Money</span>
          <span class="font-semibold">{{ CURRENCIES[award.currency as keyof typeof CURRENCIES] }}{{ award.pm }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span>Points</span>
          <span class="font-semibold">{{ award.points }}</span>
        </div>
      </template>
    </u-page-card>

    <base-loading-card
      v-else
      v-for="_ in 10"
      :key="_"
    />
  </u-page-grid>
  <error-message
    v-else
    :message="`No awards found for ${name} ${route.params.year}`"
  />
</template>
