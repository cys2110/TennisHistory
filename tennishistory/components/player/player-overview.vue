<script setup lang="ts">
const props = defineProps<{ player: PlayerDetails }>()
const { ch, ch_date, wl, titles, pm, age, dob, height, plays, bh, coaches, dod, hof } = props.player

const playerDetails = [
  { title: "Career High", value: ch ?? "—", description: ch_date },
  { title: "Win-Loss", value: wl },
  { title: "Titles", value: titles },
  { title: "Prize Money", value: `$${pm}` },
  { title: "Age", value: age ? `${age} years` : "Unknown", description: dod ? `${dob} - ${dod}` : dob ?? "" },
  { title: "Height", value: height ? `${height.low} cm (${heightFt(height.low)})` : "—" },
  { title: "Plays", value: handedness(plays) },
  { title: "Backhand", value: backhand(bh) },
  { title: "Hall of Fame Induction", value: hof ?? "—" }
]
</script>

<template>
  <u-page-grid>
    <u-page-card
      v-for="detail in playerDetails"
      :key="detail.title"
      :title="detail.title"
      :description="detail.value"
    >
      <template
        #footer
        v-if="detail.description"
      >
        {{ detail.description }}
      </template>
    </u-page-card>
    <u-page-card :title="coaches.length === 1 ? 'Coach' : 'Coaches'">
      <template #description>
        <div
          v-if="coaches.length > 0"
          v-for="coach in coaches"
          :key="coach.id"
        >
          <nuxt-link
            v-if="coach.name"
            class="hover-link"
            :to="{ name: 'player', params: { name: useChangeCase(coach.name, 'kebabCase').value, id: coach.id } }"
          >
            {{ coach.name }}
          </nuxt-link>
          <template v-else>{{ coach.id }}</template>
        </div>
        <template v-else>—</template>
      </template>
    </u-page-card>
    <u-page-card
      class="col-span-2"
      title="Previous Representations"
    >
      <template #description>
        <div
          v-if="player.countries.length > 0"
          v-for="country in player.countries"
          :key="country.id"
        >
          <u-icon :name="`flag:${country.id}-4x3`" />
          <span>{{ country.name }}</span>
          <span>{{ country.dates }}</span>
        </div>
        <template v-else>—</template>
      </template>
    </u-page-card>
  </u-page-grid>
</template>
