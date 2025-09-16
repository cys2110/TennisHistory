<script setup lang="ts">
const { event } = defineProps<{ event: UmpireAPIType }>()
const {
  ui: { icons }
} = useAppConfig()
</script>

<template>
  <div :id="`event-${event.id}`">
    <u-card :class="`ring-${getTourColor(event.tours)}`">
      <template #header>
        <div class="flex items-center justify-between font-semibold text-base">
          <u-link
            :to="{ name: 'tournament', params: { id: event.tournament.id, name: kebabCase(event.tournament.name) } }"
            class="hover-link"
          >
            {{ event.tournament.name }}
          </u-link>
          {{ event.year }}
        </div>
      </template>

      <u-collapsible
        v-for="round in event.rounds"
        :key="round.round"
      >
        <u-button
          class="group my-2"
          :label="round.round"
          color="neutral"
          :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          block
          :trailing-icon="icons.chevronDown"
        />
        <template #content>
          <template
            v-for="match in round.matches"
            :key="match.match_no"
          >
            <u-link
              v-if="match.stats"
              :to="{
                name: 'match',
                params: {
                  id: event.tournament.id,
                  name: kebabCase(event.tournament.name),
                  year: event.year,
                  eid: event.id,
                  mid: constructMid(match.match_no, match.labels)
                }
              }"
            >
              <div class="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                <div class="flex flex-wrap items-center gap-1">
                  <template v-for="(player, index) in match.p1">
                    <u-separator
                      v-if="index > 0"
                      class="h-4"
                      orientation="vertical"
                    />
                    <u-icon
                      :name="getFlagCode(player.country as CountryInterface)"
                      class="text-xl"
                    />
                    <span>{{ player.first_name }} {{ player.last_name }}</span>
                  </template>
                </div>
                vs.
                <div class="flex flex-wrap items-center gap-1">
                  <template v-for="(player, index) in match.p2">
                    <u-separator
                      v-if="index > 0"
                      class="h-4"
                      orientation="vertical"
                    />
                    <u-icon
                      :name="getFlagCode(player.country as CountryInterface)"
                      class="text-xl"
                    />
                    <span>{{ player.first_name }} {{ player.last_name }}</span>
                  </template>
                </div>
              </div>
            </u-link>
            <div
              v-else
              class="flex flex-wrap items-center gap-2 text-xs md:text-sm"
            >
              <div class="flex flex-wrap items-center gap-1">
                <template v-for="(player, index) in match.p1">
                  <u-separator
                    v-if="index > 0"
                    class="h-4"
                    orientation="vertical"
                  />
                  <u-icon
                    :name="getFlagCode(player.country as CountryInterface)"
                    class="text-xl"
                  />
                  <span>{{ player.first_name }} {{ player.last_name }}</span>
                </template>
              </div>
              vs.
              <div class="flex flex-wrap items-center gap-1">
                <template v-for="(player, index) in match.p2">
                  <u-separator
                    v-if="index > 0"
                    class="h-4"
                    orientation="vertical"
                  />
                  <u-icon
                    :name="getFlagCode(player.country as CountryInterface)"
                    class="text-xl"
                  />
                  <span>{{ player.first_name }} {{ player.last_name }}</span>
                </template>
              </div>
            </div>
          </template>
        </template>
      </u-collapsible>

      <template #footer>
        <div class="flex justify-center">
          <event-buttons
            :tournament="event.tournament"
            :year="event.year"
            :id="event.id"
            class="mx-auto"
          />
        </div>
      </template>
    </u-card>
  </div>
</template>
