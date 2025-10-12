<script setup>
const { entry } = defineProps(["entry"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const state = reactive({
  id: entry.fid,
  draw: entry.draw,
  type: entry.type,
  rank: entry.rank
})

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/lda/update", {
      query: event.data
    })
    toast.add({
      title: "LDA updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating LDA",
      description: e.message,
      icon: icons.close,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-form
    :schema="ldaSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-3 border-b border-muted pb-2 gap-2">
      <u-form-field label="Player">
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'player', params: { id: entry.id } }"
        >
          {{ entry.id }}
        </u-link>
        <u-input
          :model-value="`${entry.first_name} ${entry.last_name}`"
          class="w-full"
          disabled
        />

        <template #hint>
          <div class="flex justify-center items-center gap-1">
            <u-badge
              :label="entry.type"
              :color="entry.type"
              size="sm"
            />
            <u-badge
              :label="entry.draw"
              :color="entry.draw"
              size="sm"
            />
          </div>
        </template>
      </u-form-field>

      <form-field
        :field="{ label: 'Rank', key: 'rank', type: 'number' }"
        v-model="state.rank"
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
