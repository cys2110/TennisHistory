<script setup lang="ts">
const { match, surface, dates } = defineProps<{
  match: Pick<
    MatchInterface,
    | "date"
    | "court"
    | "umpire"
    | "duration"
    | "winner_id"
    | "round"
    | "p1"
    | "p2"
    | "aces"
    | "dfs"
    | "serve1"
    | "serve2"
    | "bps_saved"
    | "ret1"
    | "ret2"
    | "max_speed"
    | "avg1_speed"
    | "avg2_speed"
    | "bps_converted"
    | "winners"
    | "ues"
    | "net"
  >
  surface: SurfaceInterface
  dates: string
}>()

const appConfig = useAppConfig()
const sets = computed(() => {
  const filteredSets = match.p1.sets.filter(set => set !== null)
  return filteredSets.length
})
</script>

<template>
  <u-container class="md:w-1/2 xl:w-1/3 2xl:w-1/4 border-2 border-primary-700 p-5 rounded-xl">
    <div class="text-xs sm:text-sm">
      <div class="flex flex-col sm:flex-row justify-between">
        <span class="sm:w-1/2">{{ match.date ?? dates }}</span>
        <base-link
          type="surface"
          :id="surface.id"
        />
        <span>{{ match.duration ?? "00:00" }}</span>
      </div>
      <div class="flex justify-between my-1">
        <span>{{ match.court }}</span>
        <span v-if="match.umpire">
          <base-link
            type="umpire"
            :id="match.umpire"
          />
        </span>
      </div>
    </div>

    <div class="grid grid-flow-col grid-rows-2 items-center gap-3 mt-5 text-xs sm:text-sm">
      <player-avatar :player="match.p1" />
      <player-avatar :player="match.p2" />
      <small>{{ match.p1.seed || match.p1.status ? `(${match.p1.seed ?? ""}${match.p1.status ?? ""})` : "" }}</small>
      <small>{{ match.p2.seed || match.p2.status ? `(${match.p2.seed ?? ""}${match.p2.status ?? ""})` : "" }}</small>
      <div>
        <u-icon
          v-if="match.winner_id === match.p1.id"
          :name="appConfig.ui.icons.success"
          class="text-success-600 dark:text-success-300 text-lg"
        />
        <u-badge
          v-else-if="match.p1.incomplete"
          color="error"
          :label="`${match.p1.incomplete}.`"
        />
      </div>
      <div>
        <u-icon
          v-if="match.winner_id === match.p2.id"
          :name="appConfig.ui.icons.success"
          class="text-success-600 dark:text-success-300 text-lg"
        />
        <u-badge
          v-else-if="match.p2.incomplete"
          color="error"
          :label="`${match.p2.incomplete}.`"
        />
      </div>
      <div :class="`grid grid-cols-${sets}`">
        <template
          v-for="(set, index) in match.p1.sets"
          :key="`p1-${index}`"
        >
          <!--prettier-ignore-->
          <span v-if="set">
            {{ set }}<sup v-if="match.p1.tbs[index]">{{ match.p1.tbs[index] }}</sup>
          </span>
        </template>
      </div>
      <div :class="`grid grid-cols-${sets}`">
        <template
          v-for="(set, index) in match.p2.sets"
          :key="`p2-${index}`"
        >
          <!--prettier-ignore-->
          <span v-if="set">
              {{ set }}<sup v-if="match.p2.tbs[index]">{{ match.p2.tbs[index] }}</sup>
          </span>
        </template>
      </div>
    </div>
  </u-container>
</template>
