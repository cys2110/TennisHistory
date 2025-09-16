<script setup lang="ts">
const data = {
  rounds: [
    {
      name: "1st round"
    }
  ],
  matches: [
    {
      roundIndex: 0,
      order: 0,
      sides: [
        {
          contestantId: "163911",
          scores: [
            {
              mainScore: "7",
              isWinner: true
            },
            {
              mainScore: "6",
              isWinner: true
            },
            {
              mainScore: "6",
              isWinner: true
            }
          ],
          isWinner: true
        },
        {
          contestantId: "163806",
          scores: [
            {
              mainScore: "5"
            },
            {
              mainScore: "2"
            },
            {
              mainScore: "2"
            }
          ]
        }
      ]
    }
  ],
  contestants: {
    163806: {
      entryStatus: "4",
      players: [
        {
          title: "D. Medvedev",
          nationality: "Russia"
        }
      ]
    },
    163911: {
      entryStatus: "1",
      players: [
        {
          title: "N. Djokovic",
          nationality: "Serbia"
        }
      ]
    }
  }
}

const wrapper = useTemplateRef<HTMLElement | null>("wrapper")
onMounted(async () => {
  if (wrapper.value) {
    const { createBracket } = await import("bracketry")
    createBracket(data, wrapper.value)
  }
})
</script>

<template>
  <div ref="wrapper"></div>
</template>
