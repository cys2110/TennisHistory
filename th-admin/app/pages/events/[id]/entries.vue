<script setup>
definePageMeta({ name: "entries" })

const {
  params: { id }
} = useRoute("entries")
useHead({ title: () => `${id} Entries - TH Admin` })
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const updating = ref(false)

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
  set(updating, true)
  try {
    await $fetch("/api/update-entry-info", {
      query: { id }
    })
    toast.add({
      title: "Entry info updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating entry info",
      description: e.message,
      icon: icons.close,
      color: "error"
    })
  } finally {
    set(updating, false)
  }
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Entries - ${id}`">
          <template #right>
            <u-popover>
              <u-button
                :icon="icons.menu"
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
            <u-dropdown-menu :items="routes">
              <u-button :icon="icons.tip" />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Update entry info"
            @click="updateEntryInfo"
            :icon="icons.upload"
            :loading="updating"
            :loading-icon="ICONS.uploading"
            block
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <u-page-list class="*:my-1">
          <entries-edit
            v-if="entries.length"
            v-for="(entry, index) in entries"
            :key="`entry-${index}`"
            :entry
          />
          <loading v-else-if="status === 'pending'" />
          <reload
            v-else
            message="entries"
          />
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
