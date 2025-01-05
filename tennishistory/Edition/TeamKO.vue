<script setup>
import { ref } from 'vue'
import TeamDrawCard from './TeamDrawCard.vue'

const props = defineProps(['ties'])

const final = ref([])
const sfs = ref([])
const qfs = ref([])

for (let i = 0; i < props.ties.length; i++) {
  switch (props.ties[i].round) {
    case 'QF':
      qfs.value.push(props.ties[i])
      break
    case 'SF':
      sfs.value.push(props.ties[i])
      break
    case 'F':
      final.value.push(props.ties[i])
      break
    default:
      break
  }
}
</script>

<template>
  <v-container class="w-75">
    <v-row>
      <v-col class="d-flex flex-column justify-space-around">
        <TeamDrawCard v-for="tie in qfs" :tie />
      </v-col>
      <v-col class="d-flex flex-column justify-space-around">
        <TeamDrawCard v-for="tie in sfs" :tie />
      </v-col>
      <v-col class="d-flex flex-column justify-space-around">
        <TeamDrawCard v-for="tie in final" :tie />
      </v-col>
    </v-row>
  </v-container>
</template>
