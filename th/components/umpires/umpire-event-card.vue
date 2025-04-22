<script setup lang="ts">
defineProps<{ event: UmpireDetailsType }>()
</script>

<template>
  <u-card :ui="{ root: 'flex flex-col', footer: 'justify-center mt-auto', body: 'flex-1' }">
    <template #header>
      <tournament-link
        :id="event.tid"
        :name="event.name"
        class="text-lg font-semibold"
      />
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
        :trailing-icon="ICONS.chevronDown"
      />
      <template #content>
        <match-link
          v-for="match in round.matches"
          :key="match.mid"
          :name="event.name"
          :id="event.tid"
          :eid="event.eid"
          :year="event.year"
          :mid="match.mid"
        >
          {{ match.p1 }} v. {{ match.p2 }}
        </match-link>
      </template>
    </u-collapsible>

    <template #footer>
      <event-buttons
        :name="event.name"
        :tid="event.tid"
        :year="event.year"
        :eid="event.eid"
        :draw-type="event.draw_type"
      />
    </template>
  </u-card>
</template>
