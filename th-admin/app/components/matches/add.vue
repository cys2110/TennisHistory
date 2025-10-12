<script setup>
const {
  params: { id }
} = useRoute("matches")
const { refresh } = defineProps(["refresh"])
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const open = ref(false)
const uploading = ref(false)

defineShortcuts({
  meta_enter: () => set(open, !get(open))
})

const state = reactive({
  id: id,
  s1: [],
  s2: [],
  s3: [],
  s4: [],
  s5: []
})

const numberOfSets = computed(() => {
  if (state.sets === "Best5") return 5
  return 3
})

const formFields = computed(() => [
  { label: "Tour", key: "tour", type: "select", items: tours, required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Sets", key: "sets", type: "select", items: ["Best3", "Best5"] },
  { label: "Round", key: "round", type: "select", items: rounds, required: true },
  { label: "Match No.", key: "match_no", type: "number", required: true },
  { label: "Incomplete", key: "incomplete", type: "select", items: ["B", "WO"], colSpan: state.s1?.length ? 1 : 2 }
])

const onSubmit = async event => {
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
    set(open, false)
    refresh()
  } catch (e) {
    toast.add({
      title: `Error creating match`,
      description: e.message,
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-modal
    title="Add Match"
    v-model:open="open"
  >
    <u-button
      label="Add Match"
      :icon="icons.plus"
      block
    />

    <template #body>
      <u-form
        id="match-form"
        :state
        :schema="matchSchema"
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 items-center gap-5">
          <form-field
            v-for="field in formFields"
            :key="field.key"
            :field
            v-model="state[field.key]"
          />

          <u-form-field
            v-if="state.s1?.length"
            label="Winner"
          >
            <u-select-menu
              v-model="state.winner"
              :items="state.type === 'Doubles' ? ['Team 1', 'Team 2'] : ['Player 1', 'Player 2']"
              placeholder="Select winner"
            >
              <template #content-bottom>
                <u-button
                  label="Clear"
                  size="xs"
                  @click="state.winner = undefined"
                  :icon="icons.close"
                  block
                />
              </template>
            </u-select-menu>
          </u-form-field>

          <div :class="state.type === 'Doubles' ? 'col-span-2' : ''">
            <u-form-field :label="state.type === 'Doubles' ? 'Team 1' : 'Player 1'">
              <u-field-group class="w-full">
                <entries-search
                  placeholder="player"
                  v-model="state.player_1"
                />

                <entries-search
                  v-if="state.type === 'Doubles'"
                  placeholder="player"
                  v-model="state.player_2"
                />
              </u-field-group>
            </u-form-field>
          </div>

          <div :class="state.type === 'Doubles' ? 'col-span-2' : ''">
            <u-form-field :label="state.type === 'Doubles' ? 'Team 2' : 'Player 2'">
              <u-field-group class="w-full">
                <entries-search
                  placeholder="player"
                  v-model="state.player_3"
                />

                <entries-search
                  v-if="state.type === 'Doubles'"
                  placeholder="player"
                  v-model="state.player_4"
                />
              </u-field-group>
            </u-form-field>
          </div>

          <div class="col-span-2">
            <u-form-field label="Score">
              <div class="flex flex-col gap-1">
                <u-field-group
                  v-for="n in numberOfSets"
                  :key="n"
                >
                  <u-button
                    disabled
                    :label="`Set ${n}`"
                  />

                  <input-number
                    :label="`${state.type === 'Doubles' ? 'team' : 'player'} 1 score`"
                    v-model="state[`s${n}`][0]"
                  />
                  <input-number
                    :label="`${state.type === 'Doubles' ? 'team' : 'player'} 2 score`"
                    v-model="state[`s${n}`][1]"
                  />
                  <input-number
                    label="tb low"
                    v-model="state[`t${n}`]"
                  />
                </u-field-group>
              </div>
            </u-form-field>
          </div>
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="match-form"
        type="submit"
        label="Save"
        :icon="uploading ? ICONS.uploading : icons.upload"
        block
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.error"
        block
      />
    </template>
  </u-modal>
</template>
