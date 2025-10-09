<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { entry } = defineProps<{ entry: any }>()
const toast = useToast()
const searchTerm = ref("")

const { data: players } = await useFetch("/api/players/search", {
  query: { search: searchTerm },
  default: () => []
})

type Schema = z.output<typeof withdrawalSchema>

const state = reactive<Partial<Schema>>({
  id: entry.id,
  type: entry.type,
  team_reason: entry.team_reason,
  reason: entry.reason,
  draw: entry.draw,
  team_mate: entry.team_mate?.id
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/withdrawals/update", {
      query: event.data
    })
    toast.add({
      title: "Withdrawal updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating withdrawal",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :schema="withdrawalSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-6 border-t border-muted pt-1.5 gap-3">
      <u-form-field label="Player">
        <div class="flex items-center gap-2">
          <u-link
            v-if="!entry.first_name"
            :to="{ name: 'player', params: { id: entry.pid } }"
          >
            {{ entry.id }}
          </u-link>
          <u-input
            v-else
            :value="`${entry.first_name} ${entry.last_name}`"
            disabled
            class="w-full"
          />
        </div>
      </u-form-field>

      <div class="flex justify-center items-center gap-1">
        <u-badge
          :label="entry.type"
          :color="entry.type"
        />
        <u-badge
          :label="entry.draw"
          :color="entry.draw"
        />
      </div>

      <u-form-field label="Reason">
        <u-input
          v-model="state.reason"
          placeholder="Enter reason"
          class="w-full"
        />
      </u-form-field>

      <u-form-field label="Team Reason">
        <u-input
          v-model="state.team_reason"
          placeholder="Enter team Reason"
          class="w-full"
        />
      </u-form-field>

      <u-form-field label="Team Mate">
        <u-select-menu
          v-model="state.team_mate"
          v-model:search-term="searchTerm"
          :items="[entry.team_mate, ...players]"
          value-key="id"
          label-key="label"
          placeholder="Select team mate"
          class="w-full"
        />
      </u-form-field>

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          size="sm"
          block
          icon="lucide:square-check-big"
        />
      </div>
    </div>
  </u-form>
</template>
