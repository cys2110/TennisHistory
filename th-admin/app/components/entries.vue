<script setup lang="ts">
const { query } = useRoute()

const { data: entries, status } = await useFetch("/api/get-entries", { query: { id: query.id }, default: () => [] })

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
</script>

<template>
  <client-only>
    <teleport to="#navbar">
      <u-popover>
        <u-button
          icon="lucide:table-of-contents"
          size="sm"
          class="mx-2"
        />
        <template #content>
          <u-command-palette
            placeholder="Search events"
            :groups="toc"
            :loading="status === 'pending'"
            :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
          />
        </template>
      </u-popover>
    </teleport>
  </client-only>
  <u-page-list class="*:my-2">
    <div v-if="['pending', 'idle'].includes(status)">Loading...</div>
    <edit-entry
      v-for="(entry, index) in entries"
      :key="`entry-${index}`"
      :entry
    />
  </u-page-list>
</template>
