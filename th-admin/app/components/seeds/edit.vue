<script setup>
const { seed } = defineProps(["seed"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const state = reactive({
  id: seed.id,
  type: seed.type,
  seed: seed.seed,
  q_seed: seed.q_seed,
  rank: seed.rank
})

const formFields = [
  { label: "Seed", key: "seed", type: "number" },
  { label: "Qualifying Seed", key: "q_seed", type: "number" },
  { label: "Rank", key: "rank", type: "number" }
]

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/seeds/update", {
      query: event.data
    })
    toast.add({
      title: "Seed updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating seed",
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
    :schema="seedSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-5 border-b border-muted pb-2 gap-2">
      <u-form-field label="Player">
        <u-link
          v-if="!seed.first_name"
          :to="{ name: 'player', params: { id: seed.pid } }"
        >
          {{ seed.id }}
        </u-link>
        <u-input
          v-else
          :model-value="`${seed.first_name} ${seed.last_name}`"
          disabled
        />

        <template #hint>
          <div class="flex justify-between items-center gap-1">
            <u-badge
              :label="seed.tour"
              :color="seed.tour"
              size="sm"
            />
            <u-badge
              :label="seed.type"
              :color="seed.type"
              size="sm"
            />
          </div>
        </template>
      </u-form-field>

      <form-field
        v-for="field in formFields"
        :key="field.label"
        :field
        v-model="state[field.key]"
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
