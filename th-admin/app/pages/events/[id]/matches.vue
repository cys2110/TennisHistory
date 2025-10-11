<script setup lang="ts">
definePageMeta({ name: "matches" })

const {
  params: { id }
} = useRoute("matches")
useHead({ title: () => `${id} Matches - TH Admin` })
const toast = useToast()
const addMatches = ref<number[]>([])
const {
  ui: { icons }
} = useAppConfig()
const updating = ref(false)

const { data: matches, status, refresh } = await useFetch("/api/matches/get", { query: { id }, default: () => [] })

const updateTiebreaks = async () => {
  set(updating, true)
  try {
    await $fetch("/api/update-tiebreaks", {
      query: { id }
    })
    toast.add({
      title: "Tiebreaks updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating tiebreaks",
      description: (e as Error).message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(updating, false)
  }
}

const handleAddMatch = () => {
  addMatches.value.push(Date.now())
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Matches - ${id}`">
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Add Match"
            @click="handleAddMatch"
            block
            :icon="icons.plus"
          />
          <u-button
            @click="updateTiebreaks"
            label="Update tiebreaks"
            block
            :icon="updating ? ICONS.uploading : icons.upload"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <matches-add
            v-for="n in addMatches"
            :key="`add-match-${n}`"
            :refresh
          />
          <matches-edit
            v-if="matches.length"
            v-for="match in matches"
            :key="match.id"
            :match
          />
          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="matches"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
