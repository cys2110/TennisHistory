<script setup>
const { entry } = defineProps(["entry"])
const {
  params: { id }
} = useRoute("entries")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const { data: currency, status } = await useFetch("/api/get-currency", {
  query: { id, tour: isNaN(Number(entry.id)) ? "ATP" : "WTA" },
  default: () => "USD"
})

const state = reactive({
  id: entry.fid,
  type: entry.type,
  rank: entry.rank,
  points: entry.points,
  pm: entry.pm,
  seed: entry.seed,
  status: entry.status,
  q_seed: entry.q_seed,
  q_status: entry.q_status
})

const formFields = [
  { label: "Rank", key: "rank", type: "number" },
  { label: "Points", key: "points", type: "number" },
  { label: "Prize Money", key: "pm", type: "currency" },
  { label: "Seed", key: "seed", type: "number" },
  { label: "Status", key: "status", type: "select", items: ["AL", "WC", "Q", "SE", "PR", "LL"] },
  { label: "Qualifying Seed", key: "q_seed", type: "number" },
  { label: "Qualifying Status", key: "q_status", type: "select", items: ["AL", "WC", "Q", "SE", "PR", "LL"] }
]

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/entries/update", {
      query: event.data
    })
    toast.add({
      title: "Entry updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating entry",
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(entry.id)
    toast.add({
      title: `${entry.id} copied to clipboard`,
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    console.error("Failed to copy text: ", e)
    toast.add({
      title: "Error copying to clipboard",
      icon: icons.error,
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    @submit="onSubmit"
    :schema="entrySchema"
    :state
    :id="`${entry.id}-${entry.type}`"
  >
    <div class="grid grid-cols-9 border-b border-muted pb-2 gap-1">
      <u-form-field
        label="Player"
        class="cursor-pointer"
        @click="handleCopy"
      >
        <template #hint>
          <u-badge
            :label="entry.type"
            :color="entry.type"
            size="sm"
          />
        </template>
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'player', params: { id: entry.id } }"
        >
          {{ entry.fid }}
        </u-link>
        <u-input
          v-else
          :model-value="`${entry.first_name} ${entry.last_name}`"
          disabled
          size="sm"
          class="w-full"
        />
      </u-form-field>

      <form-field
        v-for="field in formFields"
        :key="field.label"
        :field
        v-model="state[field.key]"
        :currency
      />

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          block
          :icon="uploading ? ICONS.uploading : icons.check"
        />
      </div>
    </div>
  </u-form>
</template>
