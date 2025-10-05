<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry } = defineProps<{ entry: any }>()
const toast = useToast()

type Schema = z.output<typeof ldaSchema>

const state = reactive<Partial<Schema>>({
  id: entry.fid,
  draw: entry.draw,
  type: entry.type,
  rank: entry.rank
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-lda", {
      query: event.data
    })
    toast.add({
      title: "LDA updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating LDA",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="ldaSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-4 border-t border-muted pt-1.5">
      <u-form-field label="Player">
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'edit-player', query: { id: entry.id } }"
        >
          {{ entry.id }}
        </u-link>
        <u-input
          :model-value="`${entry.first_name} ${entry.last_name}`"
          disabled
        />
      </u-form-field>

      <div class="flex items-center gap-1">
        <u-badge
          :label="entry.type"
          :color="entry.type"
        />
        <u-badge
          :label="entry.draw"
          :color="entry.draw"
        />
      </div>

      <u-form-field
        name="rank"
        label="Rank"
      >
        <u-input
          type="number"
          v-model="state.rank"
        />
      </u-form-field>

      <div class="flex items-center justify-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
        />
      </div>
    </div>
  </u-form>
</template>
