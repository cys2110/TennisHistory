<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { seed } = defineProps<{ seed: any }>()
const toast = useToast()

const schema = z.object({
  id: z.string(),
  type: z.string(),
  seed: z.number().optional(),
  q_seed: z.number().optional(),
  rank: z.number().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: seed.id,
  type: seed.type,
  seed: seed.seed,
  q_seed: seed.q_seed,
  rank: seed.rank
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/seeds/update", {
      query: event.data
    })
    toast.add({
      title: "Seed updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating seed",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-6 border-t border-muted pt-1.5 gap-2">
      <u-form-field label="Player">
        <u-link
          v-if="!seed.first_name"
          :to="{ name: 'player', params: { id: seed.id } }"
        >
          {{ seed.id }}
        </u-link>
        <u-input
          v-else
          :model-value="`${seed.first_name} ${seed.last_name}`"
          disabled
          class="w-full"
        />
      </u-form-field>

      <div class="flex justify-center items-center gap-1">
        <u-badge
          :label="seed.tour"
          :color="seed.tour"
        />
        <u-badge
          :label="seed.type"
          :color="seed.type"
        />
      </div>

      <u-form-field
        name="seed"
        label="Seed"
      >
        <u-input-number
          v-model="state.seed"
          orientation="vertical"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="q_seed"
        label="Qualifying Seed"
      >
        <u-input-number
          v-model="state.q_seed"
          orientation="vertical"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="rank"
        label="Rank"
      >
        <u-input-number
          v-model="state.rank"
          orientation="vertical"
          class="w-full"
        />
      </u-form-field>

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
          block
        />
      </div>
    </div>
  </u-form>
</template>
