<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"
import { parseDate } from "@internationalized/date"

const { match } = defineProps<{ match: any }>()
const toast = useToast()

const {
  data: umpires,
  status,
  refresh,
  execute
} = await useFetch<any[]>("/api/umpires/get", {
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
  court: match.court,
  date: match.date ? parseDate(match.date) : undefined,
  incomplete: match.incomplete,
  duration: match.duration,
  umpire: match.umpire
})

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  try {
    await $fetch("/api/matches/update", {
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
    :schema="roundSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-8 border-t border-muted pt-1.5 gap-2">
      <u-form-field
        label="ID"
        :description="match.stats ? '' : 'No stats available'"
      >
        <u-input
          :model-value="state.id"
          class="w-full"
          size="sm"
        />
      </u-form-field>
      <div class="flex justify-center items-center gap-1">
        <u-badge
          :label="match.tour"
          :color="match.tour"
          size="sm"
        />
        <u-badge
          :label="match.type"
          :color="match.type"
          size="sm"
        />
        <u-badge
          :label="match.draw"
          :color="match.draw"
          size="sm"
        />
      </div>
      <u-form-field label="Number">
        <u-input-number
          v-model="state.match_no"
          orientation="vertical"
          class="w-full"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Incomplete">
        <u-select
          v-model="state.incomplete"
          size="sm"
          placeholder="Select incomplete"
          :items="['B', 'WO']"
        />
      </u-form-field>

      <u-form-field label="Date">
        <date-picker
          v-model="state.date"
          placeholder="Select date"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Duration">
        <u-input
          v-model="state.duration"
          class="w-full"
          placeholder="HH:MM:SS"
          size="sm"
        />
      </u-form-field>

      <u-form-field label="Umpire">
        <u-select-menu
          v-model="state.umpire"
          :loading="status === 'pending'"
          :items="umpires.map((u: any) => u.id) || []"
          class="w-full"
          placeholder="Select umpire"
          size="sm"
          @update:open="
            () => {
              if (umpires.length) {
                refresh()
              } else {
                execute()
              }
            }
          "
        >
          <template #content-bottom>
            <create-person type="Umpire" />
          </template>
        </u-select-menu>
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

      <div class="col-span-8 text-sm">
        {{ match.players.join(" v ") }}
      </div>
    </div>
  </u-form>
</template>
