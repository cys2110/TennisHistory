<script setup>
const {
  params: { id }
} = useRoute("draws")
const tour = defineModel()
const type = defineModel("type")
const draw = defineModel("draw")

// API call
const { data, status } = await useFetch("/api/get-draws", {
  key: () => `draw-${id}-${tour.value}-${type.value}-${draw.value}`,
  query: { id, tour, type, draw },
  default: () => [],
  server: false
})

const formattedData = computed(() => {
  const allData = get(data)
  const rounds = useArrayUnique(
    allData.map(m => {
      if (!["3rd Place Match", "Bronze Medal Match"].includes(m.round)) {
        return m.round
      } else {
        return "Final"
      }
    })
  )
  const usedIds = new Set()

  const contestants = {}
  const matches = []

  const matchIndexMapping = {
    Final: 1,
    Semifinals: 2,
    Quarterfinals: 4,
    "Round of 16": 8,
    "Round of 32": 16,
    "Round of 64": 32,
    "Round of 128": 64
  }

  const qualifyingIndexMapping = {
    "Qualifying round 3": 1,
    "Qualifying round 2": rounds.value.includes("Qualifying round 3") ? allData.filter(m => m.round === "Qualifying round 3").length + 1 : 1,
    "Qualifying round 1": allData.filter(m => m.round !== "Qualifying round 1").length + 1
  }

  for (const match of allData) {
    const team1Id = match.t1[0].first_name
      ? match.t1
          .map(p => p.id)
          .sort()
          .join("-")
      : "Bye"
    const team2Id = match.t2[0].first_name
      ? match.t2
          .map(p => p.id)
          .sort()
          .join("-")
      : "Bye"

    if (!usedIds.has(team1Id)) {
      const object =
        team1Id === "Bye"
          ? {
              players: [{ title: "Bye" }]
            }
          : {
              players: match.t1.map(p => ({
                title: `${p.first_name} ${p.last_name}`,
                nationality: p.country.id
              }))
            }

      if ((match.f1?.seed || match.f1?.status) && !match.round.includes("Qualifying")) {
        if (match.f1.seed && match.f1.status) {
          object["entryStatus"] = `${match.f1.seed} ${match.f1.status}`
        } else {
          object["entryStatus"] = match.f1.status || match.f1.seed.toString()
        }
      } else if ((match.f1?.q_seed || match.f1?.q_status) && match.round.includes("Qualifying")) {
        if (match.f1.q_seed && match.f1.q_status) {
          object["entryStatus"] = `${match.f1.q_seed} ${match.f1.q_status}`
        } else {
          object["entryStatus"] = match.f1.q_status || match.f1.q_seed.toString()
        }
      }

      contestants[team1Id] = object
      usedIds.add(team1Id)
    }

    if (!usedIds.has(team2Id)) {
      const object =
        team2Id === "Bye"
          ? {
              players: [{ title: "Bye" }]
            }
          : {
              players: match.t2.map(p => ({
                title: `${p.first_name} ${p.last_name}`,
                nationality: p.country.id
              }))
            }

      if ((match.f2?.seed || match.f2?.status) && !match.round.includes("Qualifying")) {
        if (match.f2.seed && match.f2.status) {
          object["entryStatus"] = `${match.f2.seed} ${match.f2.status}`
        } else {
          object["entryStatus"] = match.f2.status || match.f2.seed.toString()
        }
      } else if ((match.f2?.q_seed || match.f2?.q_status) && match.round.includes("Qualifying")) {
        if (match.f2.q_seed && match.f2.q_status) {
          object["entryStatus"] = `${match.f2.q_seed} ${match.f2.q_status}`
        } else {
          object["entryStatus"] = match.f2.q_status || match.f2.q_seed.toString()
        }
      }
      contestants[team2Id] = object
      usedIds.add(team2Id)
    }

    const roundIndex = ["3rd Place Match", "Bronze Medal Match"].includes(match.round) ? rounds.value.length - 1 : rounds.value.indexOf(match.round)

    const matchIndex = ["3rd Place Match", "Bronze Medal Match"].includes(match.round)
      ? 1
      : !match.round.includes("Qualifying")
      ? match.match.match_no - matchIndexMapping[match.round]
      : match.match.match_no - qualifyingIndexMapping[match.round]

    const side1Object = {}
    const side2Object = {}

    if (match.winner === "t1") {
      side1Object.isWinner = true
    } else {
      side2Object.isWinner = true
    }

    side1Object.contestantId = match.t1[0].first_name ? team1Id : "Bye"
    side2Object.contestantId = match.t2[0].first_name ? team2Id : "Bye"

    for (let i = 1; i <= 5; i++) {
      if (isDefined(match["s1"]?.[`s${i}`])) {
        const s1Score = {
          mainScore: match.s1[`s${i}`]
        }
        const s2Score = {
          mainScore: match.s2[`s${i}`]
        }
        if (isDefined(match.s1[`t${i}`])) {
          s1Score.subscore = match.s1[`t${i}`] ?? match.s2[`t${i}`] + 2
          s2Score.subscore = match.s2[`t${i}`] ?? match.s1[`t${i}`] + 2
        }

        if (match.s1[`s${i}`] > match.s2[`s${i}`]) {
          s1Score.isWinner = true
        } else if (match.s1[`s${i}`] < match.s2[`s${i}`]) {
          s2Score.isWinner = true
        }
        side1Object.scores = [...(side1Object.scores ?? []), s1Score]
        side2Object.scores = [...(side2Object.scores ?? []), s2Score]
      }
    }

    const matchObject = {
      roundIndex,
      order: matchIndex,
      sides: [side1Object, side2Object]
    }

    if (["3rd Place Match", "Bronze Medal Match"].includes(match.round)) {
      matchObject.isBronzeMatch = true
    }

    if ((match.match.incomplete && match.match.incomplete !== "B") || match.s1?.incomplete || match.s2?.incomplete) {
      matchObject.matchStatus = match.match.incomplete ?? match.s1?.incomplete ?? match.s2.incomplete
    }

    matches.push(matchObject)
  }

  const lastRoundsCount = allData?.[0]?.round?.includes("Qualifying")
    ? Object.keys(contestants).length > 32
      ? 4
      : Object.keys(contestants).length > 16
      ? 3
      : Object.keys(contestants).length > 8
      ? 2
      : 0
    : 0

  return {
    rounds: rounds.value.map(round => ({
      name: round
    })),
    matches,
    contestants,
    skippedLastRoundsCount: lastRoundsCount
  }
})

const wrapper = useTemplateRef("wrapper")

watch(
  formattedData,
  async val => {
    if (!wrapper.value) return
    if (!val?.rounds?.length || !val?.matches?.length) return

    await nextTick()

    // reset container before re-rendering
    wrapper.value.innerHTML = ""

    const { createBracket } = await import("bracketry")
    createBracket(val, wrapper.value, {
      getMatchTopHTML: match => {
        if (match.isBronzeMatch) {
          return "Bronze Medal"
        } else {
          return ""
        }
      },
      navButtonsPosition: "overTitles",
      matchTextColor: "#94a3b8",
      roundTitleColor: "#94a3b8",
      connectionLinesWidth: 2,
      connectionLinesColor: "#64748b",
      highlightedConnectionLinesColor: "#a78bfa",
      highlightedPlayerTitleColor: "#a78bfa",
      matchStatusBgColor: "#1e3a8a"
    })
  },
  { immediate: true }
)
</script>

<template>
  <div
    ref="wrapper"
    class="max-h-200 max-w-380 overflow-y-auto"
  />
</template>
