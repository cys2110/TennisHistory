<script setup lang="ts">
definePageMeta({ name: "match" })
const { icons } = useAppConfig()

const {
  params: { name: paramName, mid, eid }
} = useRoute()
const name = computed(() => decodeName(paramName as string))
useHead({ title: () => name.value, templateParams: { subPage: "Tournaments" } })

// API call
const { data: match, status } = await useFetch<MatchDetailsType>("/api/match-details", {
  query: { mid: mid, id: eid }
})
</script>

<template>
  <page-wrapper>
    <div>{{ match?.match.p1 }}</div>
    <div>{{ match?.match.p2 }}</div>
    <div>Aces: {{ match?.match.aces }}</div>
    <div>Doubles: {{ match?.match.dfs }}</div>
    <div>Serve1: {{ match?.match.serve1 }}</div>
    <div>Serve2: {{ match?.match.serve2 }}</div>
    <div>BPs Saved: {{ match?.match.bps_saved }}</div>
    <div>Return1: {{ match?.match.ret1 }}</div>
    <div>Return2: {{ match?.match.ret2 }}</div>
    <div>BPs Converted: {{ match?.match.bps_converted }}</div>
    <div>Winners: {{ match?.match.winners }}</div>
    <div>Unforced Errors: {{ match?.match.ues }}</div>
    <div>Net: {{ match?.match.net }}</div>
    <div>Max Speed: {{ match?.match.max_speed }}</div>
    <div>Avg 1st Serve: {{ match?.match.avg1_speed }}</div>
    <div>Avg 2nd Serve: {{ match?.match.avg2_speed }}</div>
  </page-wrapper>
</template>
