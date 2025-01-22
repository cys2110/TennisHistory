<script setup lang="ts">
const props = defineProps<{ match: MatchType }>()
const { date, dates, surface, court, duration, umpire, p1, winner, p2 } = props.match
</script>

<template>
  <u-card class="w-2/3 mx-auto">
    <template #header>
      <div class="flex justify-between">
        <span>{{ date ?? dates }}</span>
        <span>{{ surface }}</span>
        <span>{{ duration }}</span>
      </div>
      <div class="flex justify-between">
        <span>{{ court }}</span>
        <span>{{ umpire }}</span>
      </div>
    </template>
    <div class="grid grid-cols-6 gap-2">
      <flag-icon :country="p1.country" />
      <player-avatar
        :id="p1.id"
        :name="p1.name"
      />
      <div>
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(p1.name, 'kebabCase').value, id: p1.id } }"
        >
          {{ p1.name }}
        </nuxt-link>
        <small v-if="p1.seed || p1.status">({{ p1.seed }}{{ p1.status }})</small>
      </div>
      <div>{{ p1.rank }}</div>
      <div>
        <u-icon
          v-if="winner === p1.id"
          :name="ICONS.check"
          class="text-green-600"
        />
        <u-badge
          v-else-if="p1.incomplete"
          class="bg-red-800"
          :label="p1.incomplete"
        />
      </div>
      <div>
        <template
          v-for="(_, index) in new Array(5)"
          :key="index"
        >
          <span v-if="(p1 as any)[`s${index + 1}`]">
            {{ (p1 as any)[`s${index + 1}`] }}
            <sup v-if="(p1 as any)[`t${index + 1}`]">
              {{ (p1 as any)[`t${index + 1}`] }}
            </sup>
          </span>
        </template>
      </div>
      <flag-icon :country="p2.country" />
      <player-avatar
        :id="p2.id"
        :name="p2.name"
      />
      <div>
        <nuxt-link
          class="hover-link"
          :to="{ name: 'player', params: { name: useChangeCase(p2.name, 'kebabCase').value, id: p2.id } }"
        >
          {{ p2.name }}
        </nuxt-link>
        <small v-if="p2.seed || p2.status">({{ p2.seed }}{{ p2.status }})</small>
      </div>
      <div>{{ p2.rank }}</div>
      <div>
        <u-icon
          v-if="winner === p2.id"
          :name="ICONS.check"
          class="text-green-600"
        />
        <u-badge
          v-else-if="p2.incomplete"
          class="bg-red-800"
          :label="p2.incomplete"
        />
      </div>
      <div>
        <template
          v-for="(_, index) in new Array(5)"
          :key="index"
        >
          <span v-if="(p2 as any)[`s${index + 1}`]">
            {{ (p2 as any)[`s${index + 1}`] }}
            <sup v-if="(p2 as any)[`t${index + 1}`]">
              {{ (p2 as any)[`t${index + 1}`] }}
            </sup>
          </span>
        </template>
      </div>
    </div>
  </u-card>
</template>
