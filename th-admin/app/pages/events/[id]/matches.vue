<script setup lang="ts">
definePageMeta({ name: "matches" })

const {
  params: { id }
} = useRoute("matches")
useHead({ title: () => `${id} Matches - TH Admin` })
const toast = useToast()

const { data: matches, status } = await useFetch("/api/matches/get", { query: { id }, default: () => [] })

const updateTiebreaks = async () => {
  try {
    await $fetch("/api/update-tiebreaks", {
      query: { id }
    })
    toast.add({
      title: "Tiebreaks updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating tiebreaks",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Matches - ${id}`">
          <template #right>
            <u-button
              @click="updateTiebreaks"
              label="Update tiebreaks"
              size="sm"
            />
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-list class="*:m-2">
          <edit-match
            v-if="matches.length"
            v-for="match in matches"
            :key="match.id"
            :match
          />
          <div v-else-if="status === 'pending'">Loading...</div>
          <div
            v-else
            class="flex flex-col gap-2"
          >
            <div>No entries found.</div>
            <u-button
              label="Refresh"
              @click="() => reloadNuxtApp()"
            />
          </div>
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
