<script setup lang="ts">
const props = defineProps<{ event: PlayerActivityType; year: string }>()
const { name, ename, tid, city, country, dates, surface, category, seed, status, points, rank, pm, currency, eid } = props.event

const earnings = {
  Seed: seed,
  Status: status,
  Points: points,
  Rank: rank,
  ...(currency && { "Prize Money": `${CURRENCIES[currency]}${pm}` })
}

// const tagColors = {
//     Seed: "bg-orange-500 text-orange-800",
//     Status: "bg-fuchsia-500 text-fuchsia-800",
//     Points: "bg-teal-500 text-teal-800",
//     Rank: "bg-blue-500 text-blue-800",
//     "Prize Money": "bg-emerald-500 text-emerald-800"
// };
</script>

<template>
  <u-card>
    <template #header>
      <div class="flex gap-5">
        <div v-if="category">
          <category-avatar :category />
        </div>
        <div class="flex flex-col flex-1">
          <div class="flex justify-between">
            <nuxt-link
              class="hover-link"
              :to="{ name: 'tournament', params: { name: useChangeCase(name, 'kebabCase').value, tid } }"
            >
              {{ name }}
            </nuxt-link>
            <div v-if="ename">{{ ename }}</div>
          </div>
          <div class="grid grid-cols-3">
            <div>
              {{ city }}
              <flag-icon :country />
            </div>
            <div>{{ surface }}</div>
            <div class="text-right">{{ dates }}</div>
          </div>
        </div>
      </div>
    </template>

    <activity-table
      :event
      :year
    />

    <template #footer>
      <div>
        <div class="flex gap-1 items-center">
          <template
            v-for="(value, key) in earnings"
            :key
          >
            <u-badge v-if="value">{{ key }}: {{ value }}</u-badge>
          </template>
        </div>
        <event-buttons
          :name
          :tid
          :year
          :eid
        />
      </div>
    </template>
  </u-card>
</template>
