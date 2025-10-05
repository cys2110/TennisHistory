<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry } = defineProps<{ entry: any }>()
const { query } = useRoute()
const toast = useToast()

const { data: currency, status } = await useFetch("/api/get-currency", { query: { id: query.id }, default: () => "USD" })

const schema = z.object({
  fid: z.string(),
  type: z.string(),
  rank: z.number().optional(),
  points: z.number().optional(),
  pm: z.number().optional(),
  seed: z.number().optional(),
  status: z.string().optional(),
  q_seed: z.number().optional(),
  q_status: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  fid: entry.fid,
  type: entry.type,
  rank: entry.rank,
  points: entry.points,
  pm: entry.pm,
  seed: entry.seed,
  status: entry.status,
  q_seed: entry.q_seed,
  q_status: entry.q_status
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  console.log("submitting")
  try {
    await $fetch("/api/update-entry", {
      query: event.data
    })
    toast.add({
      title: "Entry updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating entry",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    @submit="onSubmit"
    :schema
    :state
    :id="`${entry.id}-${entry.type}`"
  >
    <div class="grid grid-cols-10 justify-items-center border-t border-muted pt-1.5 gap-0.5">
      <u-form-field label="Player">
        <u-link
          v-if="!entry.first_name"
          :to="{ name: 'edit-player', query: { id: entry.id } }"
        >
          {{ entry.fid }}
        </u-link>
        <u-input
          v-else
          :model-value="`${entry.first_name} ${entry.last_name}`"
          disabled
          size="sm"
        />
      </u-form-field>
      <div class="flex items-center justify-center">
        <u-badge
          :label="entry.type"
          :color="entry.type"
          size="sm"
        />
      </div>
      <u-form-field label="Rank">
        <u-input-number
          v-model="state.rank"
          orientation="vertical"
          placeholder="Rank"
          size="sm"
        />
      </u-form-field>
      <u-form-field label="Points">
        <u-input-number
          v-model="state.points"
          orientation="vertical"
          placeholder="Points"
          size="sm"
        />
      </u-form-field>
      <u-form-field label="PM">
        <u-input-number
          v-model="state.pm"
          orientation="vertical"
          placeholder="Prize Money"
          size="sm"
          :format-options="{
            style: 'currency',
            currency: currency || 'USD'
          }"
        />
      </u-form-field>
      <u-form-field label="Seed">
        <u-input-number
          v-model="state.seed"
          orientation="vertical"
          size="sm"
          placeholder="Seed"
        />
      </u-form-field>
      <u-form-field label="Status">
        <u-select
          v-model="state.status"
          :items="['AL', 'WC', 'Q', 'SE', 'PR', 'LL']"
          placeholder="Select status"
          size="sm"
        />
      </u-form-field>
      <u-form-field label="Q Seed">
        <u-input-number
          v-model="state.q_seed"
          orientation="vertical"
          size="sm"
          placeholder="Q Seed"
        />
      </u-form-field>
      <u-form-field label="Q Status">
        <u-select
          v-model="state.q_status"
          :items="['AL', 'WC', 'Q', 'SE', 'PR', 'LL']"
          placeholder="Select status"
          size="sm"
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
