<script setup lang="ts">
import { useChangeCase } from "@vueuse/integrations/useChangeCase"
const router = useRouter()
const route = useRoute()
const props = defineProps<{ player: H2HPlayer; index: number }>()
const { bh, dob, id, name, height, rh, pro, country } = props.player
const searchTerm = ref("")
const value = ref({ label: name, value: id, country: country })

const playerDetails = [
  { title: "DOB", value: dob ?? "Unknown" },
  { title: "Height", value: height ? `${height.low}cm (${heightFt(height.low)})` : "Unknown" },
  { title: "Plays", value: handedness(rh) },
  { title: "Backhand", value: backhand(bh) },
  { title: "Turned pro", value: pro ?? "Unknown" }
]

const {
  data: selectOptions,
  status,
  error
} = await useFetch<{ label: string; value: string; country: string }[]>("/api/getPlayerSearchResults", {
  query: { searchTerm },
  immediate: false
})

watch(
  () => value.value,
  () => {
    router.push(`/h2h/${props.index === 1 ? useChangeCase(value.value.label, "kebabCase").value : route.params.p1Name}-v-${props.index === 2 ? useChangeCase(value.value.label, "kebabCase").value : route.params.p2Name}/${props.index === 1 ? value.value.value : route.params.p1Id}-${props.index === 2 ? value.value.value : route.params.p2Id}`)
  },
  { immediate: false }
)
</script>

<template>
  <u-card>
    <template #header>
      <div>
        <player-avatar
          :id="id"
          :name="name"
        />
        <div class="flex justify-between">
          <span>{{ name }}</span>
          <flag-icon :country="country" />
        </div>
      </div>
    </template>
    <u-page-list>
      <div
        v-for="detail in playerDetails"
        :key="detail.title"
        class="flex justify-between items-center"
      >
        <span>{{ detail.title }}</span>
        <span class="font-semibold">{{ detail.value }}</span>
      </div>
    </u-page-list>
    <template #footer>
      <u-select-menu
        v-model="value"
        v-model:search-term="searchTerm"
        :items="selectOptions || []"
      />
      <div v-if="error">{{ error }}</div>
    </template>
  </u-card>
</template>
