<script setup>
definePageMeta({ name: "entries" })

const {
  params: { id }
} = useRoute("entries")
useHead({ title: () => `${id} Entries - TH Admin` })

const { data: entries, status } = await useFetch("/api/entries/get", {
  query: { id },
  default: () => []
})

const toc = computed(() => [
  {
    id: "entries",
    label: "Entries",
    items: entries.value.map(entry => ({
      label: entry.first_name ? `${entry.first_name} ${entry.last_name} - ${entry.type}` : `${entry.id} - ${entry.type}`,
      to: `#${entry.id}-${entry.type}`
    }))
  }
])

const updateEntryInfo = async () => {
  try {
    await $fetch("/api/update-entry-info", {
      query: { id }
    })
    toast.add({
      title: "Entry info updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating entry info",
      description: e.message,
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
        <u-dashboard-navbar :title="`Entries - ${id}`">
          <template #right>
            <u-button
              label="Update entry info"
              @click="updateEntryInfo"
              size="sm"
            />
            <u-popover>
              <u-button
                icon="lucide:table-of-contents"
                size="sm"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search entries"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
      </template>

      <template #body>
        <u-page-list
          v-if="entries.length"
          class="*:my-2"
        >
          <entries-edit
            v-for="(entry, index) in entries"
            :key="`entry-${index}`"
            :entry
          />
        </u-page-list>
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
      </template>
    </u-dashboard-panel>
  </div>
</template>
