<script setup lang="ts">
const formatName = useFormatName()
const toast = useToast()
const tid = useRouteParams<string>("tid")

// API call
const { data: events } = await useFetch<TournamentNumbers[]>("/api/tournament-numbers", {
  query: { tid },
  onResponseError: () => {
    toast.add({
      title: `Error fetching numbers for ${formatName.capitaliseName.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// TODO
</script>

<template>
  <div> Component: tournaments/tournament-numbers </div>
</template>
