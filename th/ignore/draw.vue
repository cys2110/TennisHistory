<script setup lang="ts">
definePageMeta({ name: "draw", layout: "event-layout" })
const route = useRoute()
const toast = useToast()
const selectedRound = ref(1)

const { data: results, status } = await useFetch<EventDrawType[]>("/api/eventDraw", {
  query: { eid: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container
    v-if="results"
    class="overflow-x-hidden flex flex-nowrap"
  >
    <div
      v-for="round in results"
      :key="round.number"
      class="flex flex-col w-fit"
    >
      <div>{{ round.round }}</div>
      <div class="flex-1">
        <draw-card
          v-for="match in round.matches"
          :key="match.mid"
          :match
        />
      </div>
    </div>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
  >
    No draw available
  </error-message>
</template>
