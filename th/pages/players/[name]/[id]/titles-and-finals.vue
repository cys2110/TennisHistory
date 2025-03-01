<script setup lang="ts">
definePageMeta({ name: "titles", layout: "player-layout" })
const toast = useToast()
const formatName = useFormatName()
const id = useRouteParams<string>("id")
const checked = ref(false)

// API call
const { data: results } = await useFetch<Record<"titles" | "finals", TitlesAndFinalsType[]>>("/api/titlesAndFinals", {
  query: { id },
  onResponseError: error => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s titles and finals`,
      icon: ICONS.error,
      description: error.error?.message
    })
  }
})
</script>

<template>
  <u-container v-if="results">
    <u-switch
      v-model="checked"
      :checked-icon="ICONS['no-trophy']"
      :unchecked-icon="ICONS.trophy"
      class="justify-self-end"
    />

    <titles-stepper :events="checked ? results.finals : results.titles" />
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-trophy']"
    :title="`${formatName.capitaliseName.value} has not won any titles or reached any finals`"
  />
</template>
