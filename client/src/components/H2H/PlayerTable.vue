<script setup lang="ts">
import { computed, type Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import Select from 'primevue/select'
import { SEARCH_PLAYER } from '@/services/MiscService'
import { convertToFt, encodeName, headshot, smallDate } from '@/utils/functions'
import type { Player } from '@/utils/types'

const router = useRouter()
const route = useRoute()

const props = defineProps<{
  player: Pick<Player, 'bh1' | 'career_high' | 'ch_date' | 'country' | 'dob' | 'full_name' | 'height_cm' | 'id' | 'loss' | 'pm_USD' | 'rh' | 'titles' | 'turned_pro' | 'win'>
  number: number
}>()

const cardOptions = {
  background: props.number === 1 ? '{cyan.700}' : '{violet.800}'
}

const dividerOptions = {
  borderColor: '{zinc.400}',
}

const selectOptions = {
  borderColor: '{zinc-400}',
  background: 'transparent',
  color: '{zinc.300}',
  focusBorderColor: '{zinc.300}',
}

const floatLabelOptions = {
  onActiveBackground: props.number === 1 ? '{cyan.700}' : '{violet.800}',
  color: '{zinc.300}',
  focusColor: '{zinc.300}',
}

const imageUrl = headshot(props.player.id)

interface SearchPlayer {
  full_name: string
  id: string
  country: { id: string; name: string }
}
const searchTerm = ref('')
const options: Ref<SearchPlayer[]> = ref([])

const { query, variables } = SEARCH_PLAYER(searchTerm.value)
const { result, loading, error, refetch } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) options.value = newResult.searchPlayers
})

watch(error, (newError) => console.error(newError))

const playingHand = computed(() => {
  switch (props.player.rh) {
    case true:
      return 'Right-handed'
    case false:
      return 'Left-handed'
    default:
      return 'Unknown'
  }
})

const backhand = computed(() => {
  switch (props.player.bh1) {
    case true:
      return 'One-handed'
    case false:
      return 'Two-handed'
    default:
      return 'Unknown'
  }
})

const descriptionItems = [
  { title: 'DOB', value: props.player.dob ? smallDate(props.player.dob) : 'Unknown' },
  {
    title: 'Height',
    value: props.player.height_cm
      ? `${props.player.height_cm} cm (${convertToFt(props.player.height_cm)})`
      : 'Unknown',
  },
  { title: 'Plays', value: playingHand },
  { title: 'Backhand', value: backhand },
  { title: 'Turned pro', value: props.player.turned_pro?.id ?? 'Unknown' },
]

const handleSearch = () => {
  refetch({ fullName: searchTerm.value })
}

const handleSelect = (e: { value: { full_name: string, id: string } }) => {
  if (props.number === 1) {
    router.push({
      name: 'h2h',
      params: {
        p1Name: encodeName(e.value.full_name),
        p1Id: e.value.id,
        p2Name: route.params.p2Name,
        p2Id: route.params.p2Id,
      },
    })
  } else {
    router.push({
      name: 'h2h',
      params: {
        p1Name: route.params.p1Name,
        p1Id: route.params.p1Id,
        p2Name: encodeName(e.value.full_name),
        p2Id: e.value.id,
      },
    })
  }
}
</script>

<template>
  <Card class="p-3" :dt="cardOptions">
    <template #header>
      <div class="!rounded-full flex justify-center items-center w-[125px] mx-auto h-[125px] border-[1px]"
        :style="`background-image: url(${imageUrl}); background-size: contain`" />
    </template>
    <template #title>
      <div class="flex justify-between items-center">
        <div class="font-bold">{{ player.full_name }}</div>
        <div>
          <GetFlag :country="player.country.id" />
        </div>
      </div>
      <Divider :dt="dividerOptions" />
    </template>
    <template #content>
      <div v-for="item in descriptionItems" :key="item.title" class="flex justify-between my-1">
        <span>{{ item.title }}</span>
        <span class="font-bold">{{ item.value }}</span>
      </div>
    </template>
    <template #footer>
      <Divider :dt="dividerOptions" />
      <FloatLabel variant="on" :dt="floatLabelOptions">
        <Select v-model="searchTerm" placeholder="Search player" inputId="search_player" :options editable
          optionLabel="full_name" class="w-full" @update:model-value="handleSearch" @change="handleSelect"
          :dt="selectOptions" />
        <label for="search_player">Search player</label>
      </FloatLabel>
    </template>
  </Card>
</template>