<script setup lang="ts">
definePageMeta({ name: "h2h-players" })
const p1Name = useRouteParams<string>("p1Name")
const p2Name = useRouteParams<string>("p2Name")
const p1Id = useRouteParams<string>("p1Id")
const p2Id = useRouteParams<string>("p2Id")
const toast = useToast()
const formatName = useFormatName()

// API call
const { data: h2h } = await useFetch<H2HType>("/api/h2h", {
  query: { p1Id, p2Id },
  onResponseError: ({ error }) => {
    toast.add({
      title: "Error fetching head to head data",
      icon: ICONS.error,
      description: error?.message
    })
  }
})

const p1_name = computed(() => h2h.value?.p1.name ?? p1Name.value)
formatName.name.value = p1_name.value
const p2_name = computed(() => h2h.value?.p2.name ?? p2Name.value)
formatName.name.value = p2_name.value

useHead({ title: `${p1_name.value} vs ${p2_name.value}` })

// Header links
const links = computed(() => [
  {
    label: p1_name.value,
    to: { name: "player", params: { name: p1Name.value, id: p1Id.value } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${p1Id.value}`
    },
    color: "secondary",
    variant: "subtle"
  },
  {
    label: p2_name.value,
    to: { name: "player", params: { name: p2Name.value, id: p2Id.value } },
    avatar: {
      src: `https://www.atptour.com/-/media/alias/player-headshot/${p2Id.value}`
    },
    color: "secondary",
    variant: "subtle"
  }
])

const winLoss = computed(() => {
  if (h2h.value) {
    const totalMatches = h2h.value.matches.length
    const p1Wins = h2h.value.matches.filter(match => match.winner_id === p1Id.value).length
    return [p1Wins, totalMatches - p1Wins]
  }
  return [0, 0]
})
</script>

<template>
  <u-page>
    <!--@vue-expect-error-->
    <u-page-header
      headline="Head to Head"
      :links
      :title="`${p1_name} v. ${p2_name}`"
    />

    <u-page-body>
      <template v-if="h2h">
        <u-page-columns class="xl:w-4/5 2xl:2/3 mx-auto">
          <h2h-player-card
            :player="h2h.p1"
            :index="1"
          />
          <div class="flex flex-col items-center">
            <h2h-doughnut-chart :winLoss />
            <h2h-table :h2h />
          </div>
          <h2h-player-card
            :player="h2h.p2"
            :index="2"
          />
        </u-page-columns>

        <h2h-match-table
          :matches="h2h.matches"
          :p1_name
          :p1Id
          :p2_name
          :p2Id
        />
      </template>

      <error-message
        v-else
        :icon="ICONS['no-swords']"
        :title="`No head to head data found for ${p1_name} and ${p2_name}`"
      />
    </u-page-body>
  </u-page>
</template>
