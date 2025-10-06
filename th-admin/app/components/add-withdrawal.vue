<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { query } = useRoute()
const toast = useToast()

const searchTerm = ref("")
const teamMateSearch = ref("")
const { data: players } = await useFetch("/api/search-players", {
  query: { search: searchTerm },
  default: () => []
})

const { data: teammates } = await useFetch("/api/search-players", {
  query: { search: teamMateSearch },
  default: () => []
})

type Schema = z.output<typeof withdrawalSchema>

const state = reactive<Partial<Schema>>({
  id: "",
  type: "",
  draw: "",
  team_reason: undefined,
  reason: undefined,
  eid: query.id as string,
  team_mate: undefined,
  seed: undefined,
  status: undefined,
  rank: 0
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/add-withdrawal", {
      query: event.data
    })
    toast.add({
      title: "Withdrawal created",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error creating withdrawal",
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <u-form
    :state
    :schema="withdrawalSchema"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-10 border-t border-muted pt-1.5 gap-2">
      <u-form-field
        name="id"
        label="Player"
      >
        <u-select-menu
          v-model="state.id"
          v-model:search-term="searchTerm"
          :items="players"
          value-key="id"
          label-key="label"
          placeholder="Select player"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="type"
        label="Type"
      >
        <u-select
          v-model="state.type"
          :items="['Singles', 'Doubles']"
          placeholder="Select type"
          class="w-full"
        />
      </u-form-field>
      <u-form-field
        name="draw"
        label="Draw"
      >
        <u-select
          v-model="state.draw"
          :items="['Main', 'Qualifying']"
          placeholder="Select draw"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="reason"
        label="Reason"
      >
        <u-input
          v-model="state.reason"
          placeholder="Reason"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="team_reason"
        label="Team Reason"
      >
        <u-input
          v-model="state.team_reason"
          placeholder="Team Reason"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="team_mate"
        label="Team Mate"
      >
        <u-select-menu
          v-model="state.team_mate"
          v-model:search-term="teamMateSearch"
          :items="teammates"
          value-key="id"
          label-key="label"
          placeholder="Select team mate"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="seed"
        label="Seed"
      >
        <u-input-number
          v-model="state.seed"
          placeholder="Seed"
          orientation="vertical"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="status"
        label="Status"
      >
        <u-select
          v-model="state.status"
          :items="['AL', 'WC', 'Q', 'SE', 'PR', 'LL']"
          placeholder="Select status"
          class="w-full"
        />
      </u-form-field>

      <u-form-field
        name="rank"
        label="Rank"
      >
        <u-input-number
          v-model="state.rank"
          placeholder="Rank"
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
