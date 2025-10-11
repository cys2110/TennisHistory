<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const {
  params: { id }
} = useRoute("matches")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const { data: entries, status } = await useFetch<any[]>("/api/entries/get", {
  query: { id },
  default: () => [],
  transform: data =>
    get(useArrayUnique(data, (a, b) => a.id === b.id)).map(entry => ({
      id: entry.id,
      label: entry.first_name ? `${entry.first_name} ${entry.last_name}` : entry.id
    }))
})

const schema = z.object({
  id: z.string(),
  tour: z.string(),
  draw: z.string(),
  type: z.string(),
  round: z.string(),
  match_no: z.number(),
  sets: z.string().optional(),
  player_1: z.string().optional(),
  player_2: z.string().optional(),
  player_3: z.string().optional(),
  player_4: z.string().optional(),
  incomplete: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: id as string
})

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Tour", key: "tour", type: "select", items: tours, required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Round", key: "round", type: "select", items: rounds, required: true },
  { label: "Match No.", key: "match_no", type: "number", required: true },
  { label: "Sets", key: "sets", type: "select", items: ["Best3", "Best5"] },
  { label: "Incomplete", key: "incomplete", type: "select", items: ["B", "WO"] },
  { label: "Player 1", key: "player_1", type: "selectMenu", items: get(entries), loading: get(status) === "pending" },
  { label: "Player 2", key: "player_2", type: "selectMenu", items: get(entries), loading: get(status) === "pending" },
  { label: "Player 3", key: "player_3", type: "selectMenu", items: get(entries), loading: get(status) === "pending" },
  { label: "Player 4", key: "player_4", type: "selectMenu", items: get(entries), loading: get(status) === "pending" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/matches/add", {
      query: event.data
    })
    toast.add({
      title: `Match created`,
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error creating match`,
      description: (e as Error).message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-form
    :state
    :schema
    @submit="onSubmit"
  >
    <div class="grid grid-cols-12 border-b border-muted pb-2 gap-2">
      <form-field
        v-for="field in formFields"
        :key="field.key"
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
