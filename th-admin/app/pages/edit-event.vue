<script setup lang="ts">
useHead({ title: "Edit Event - TH Admin" })

const { query } = useRoute()
const toast = useToast()

const selectedTab = ref("details")
const tabItems = [
  { label: "Details", value: "details" },
  { label: "Rounds", value: "rounds" },
  { label: "Seeds", value: "seeds" },
  { label: "LDA", value: "lda" },
  { label: "Retirements", value: "retirements" },
  { label: "Walkovers", value: "walkovers" },
  { label: "Defaults", value: "defaults" },
  { label: "Withdrawals", value: "withdrawals" },
  { label: "Entries", value: "entries" }
]

const updateTiebreaks = async () => {
  try {
    await $fetch("/api/update-tiebreaks", {
      query: { id: query.id }
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
const updateEntryInfo = async () => {
  try {
    await $fetch("/api/update-entry-info", {
      query: { id: query.id }
    })
    toast.add({
      title: "Entry info updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating entry info",
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
        <u-dashboard-navbar :title="`Edit Event - ${query.id}`">
          <template #right>
            <div id="navbar" />
            <u-button
              label="Update entry info"
              @click="updateEntryInfo"
              size="sm"
            />
            <u-button
              @click="updateTiebreaks"
              label="Update tiebreaks"
              size="sm"
            />
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-tabs
            v-model="selectedTab"
            :items="tabItems"
            size="sm"
            class="w-full mt-2.5"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <edit-event v-if="selectedTab === 'details'" />
        <rounds v-else-if="selectedTab === 'rounds'" />
        <seeds v-else-if="selectedTab === 'seeds'" />
        <lda v-else-if="selectedTab === 'lda'" />
        <retirements v-else-if="selectedTab === 'retirements'" />
        <walkovers v-else-if="selectedTab === 'walkovers'" />
        <defaults v-else-if="selectedTab === 'defaults'" />
        <withdrawals v-else-if="selectedTab === 'withdrawals'" />
        <entries v-else-if="selectedTab === 'entries'" />
      </template>
    </u-dashboard-panel>
  </div>
</template>
