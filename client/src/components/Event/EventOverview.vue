<script setup lang="ts">
import { CURRENCIES } from '@/utils/variables'
import type { EventDetailsType } from '@/utils/types'

const props = defineProps<{
  event: EventDetailsType
}>()
const { currency, pm, tfc, venue } = props.event

const statistics = [
  { title: 'Prize Money', value: pm || '—' },
  { title: 'Total Financial Commitment', value: tfc || '—' },
]
</script>

<template>
  <a-row id="details" justify="space-evenly" :gutter="[0, 16]">
    <a-col :xs="24" :sm="11" :md="10" :xl="7" v-for="stat in statistics" :key="stat.title">
      <a-card class="full-card">
        <a-statistic :prefix="currency ? CURRENCIES[currency] : ''" :title="stat.title" :value="stat.value"
          class="text-center" />
      </a-card>
    </a-col>
  </a-row>

  <EventDescriptionItems :event />

</template>