<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import { parseDate } from "@internationalized/date"
import * as z from "zod"

const { match } = defineProps<{ match: any }>()
const toast = useToast()

const {
  data: umpires,
  status: umpireStatus,
  execute: executeUmpires,
  refresh: refreshUmpires
} = await useFetch("/api/get-umpires", {
  default: () => [],
  immediate: false
})

const schema = z.object({
  id: z.string(),
  tour: z.string(),
  draw: z.string(),
  type: z.string(),
  match_no: z.number(),
  court: z.string().optional(),
  date: z.unknown().optional(),
  incomplete: z.string().optional(),
  duration: z.string().optional(),
  umpire: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  id: match.id,
  tour: match.tour,
  draw: match.draw,
  type: match.type,
  match_no: match.match_no,
  date: match.date ? parseDate(match.date) : undefined,
  court: match.court,
  incomplete: match.incomplete,
  duration: match.duration,
  umpire: match.umpire
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/update-match", {
      query: event.data
    })
    toast.add({
      title: "Match updated",
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating match",
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
      <u-form-field label="ID">
        <u-input
          v-model="state.id"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <div class="flex justify-center items-center gap-1">
        <u-badge
          :label="match.tour"
          :color="match.tour"
        />
        <u-badge
          :label="match.type"
          :color="match.type"
        />
        <u-badge
          :label="match.draw"
          :color="match.draw"
        />
      </div>

      <u-form-field label="Match No">
        <u-input-number
          v-model="state.match_no"
          class="w-full"
          orientation="vertical"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Players">
        <div class="text-xs">{{ match.players.join(" v ") }}</div>
      </u-form-field>

      <u-form-field label="Date">
        <date-picker
          v-model="state.date"
          class="w-full"
          placeholder="Select date"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Incomplete">
        <u-select
          v-model="state.incomplete"
          class="w-full"
          placeholder="Select incomplete"
          :items="['B', 'WO']"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Duration">
        <u-input
          v-model="state.duration"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Court">
        <u-input
          v-model="state.court"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Umpire">
        <u-select-menu
          v-model="state.umpire"
          :loading="umpireStatus === 'pending'"
          :items="umpires.map(u => u.id) || []"
          class="w-full"
          placeholder="Select umpire"
          size="sm"
          @update:open="
            () => {
              if (umpires.length) {
                refreshUmpires()
              } else {
                executeUmpires()
              }
            }
          "
        >
          <template #content-bottom>
            <create-person type="Umpire" />
          </template>
        </u-select-menu>
      </u-form-field>

      <u-form-field label="Stats">
        {{ match.stats ? "Yes" : "No" }}
      </u-form-field>

      <div class="flex items-center col-span-2">
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
