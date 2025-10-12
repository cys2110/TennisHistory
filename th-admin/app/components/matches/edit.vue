<script setup>
import { parseDate } from "@internationalized/date"

const { match } = defineProps(["match"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const state = reactive({
  id: match.id,
  tour: match.tour,
  draw: match.draw,
  type: match.type,
  match_no: match.match_no,
  court: match.court,
  date: match.date ? parseDate(match.date) : undefined,
  incomplete: match.incomplete,
  duration: match.duration,
  umpire: match.umpire ?? undefined,
  round: match.round,
  best_of: match.best_of
})

const onSubmit = async event => {
  set(uploading, true)
  try {
    await $fetch("/api/matches/update", {
      query: event.data
    })
    toast.add({
      title: "Match updated",
      icon: icons.success,
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: "Error updating match",
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}

const formFields = [
  { label: "Round", key: "round", type: "text", required: true },
  { label: "Match No.", key: "match_no", type: "number", required: true },
  { label: "Best of", key: "best_of", type: "select", items: ["Best3", "Best5"] },
  { label: "Incomplete", key: "incomplete", type: "select", items: ["B", "WO"] },
  { label: "Date", key: "date", type: "date" },
  { label: "Duration (hh:mm:ss)", key: "duration", type: "text" },
  { label: "Court", key: "court", type: "text" },
  { label: "Umpire", key: "umpire", type: "umpires" }
]
</script>

<template>
  <u-form
    :schema="matchSchema"
    :state
    @submit="onSubmit"
  >
    <div class="grid grid-cols-10 border-b border-muted pb-2 gap-2">
      <u-form-field
        label="ID"
        required
      >
        <u-input
          :model-value="state.id"
          class="w-full"
          size="sm"
        />
        <template #hint>
          <div class="flex justify-between items-center gap-1">
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
          size="sm"
          block
          :icon="uploading ? ICONS.uploading : icons.check"
        />
      </div>

      <div class="col-span-9 text-xs">
        {{
          match.players.length < 3 ? match.players.join(" v ") : match.players.slice(0, 2).join(" / ") + " v " + match.players.slice(2).join(" / ")
        }}
      </div>

      <div class="flex items-center">
        <matches-stats v-if="!match.stats" />
      </div>
    </div>
  </u-form>
</template>
