<script setup lang="ts">
definePageMeta({ name: "titles", layout: "player-layout" })
const route = useRoute()
const toast = useToast()
const checked = ref(false)

// API call
const { data: results, status } = await useFetch<Record<"titles" | "finals", TitlesFinalsType[]>>("/api/titlesAndFinals", {
  query: { id: route.params.id },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container>
    <u-switch
      v-model="checked"
      :checked-icon="ICONS['no-trophy']"
      :unchecked-icon="ICONS.trophy"
    />
    <titles-stepper
      v-if="results"
      :events="checked ? results.finals : results.titles"
    />
    <!--TODO: Add skeleton for stepper-->
    <error-message
      v-else
      :icon="ICONS['no-trophy']"
    >
      {{ useChangeCase(route.params.name as string, "capitalCase").value }}'s {{ checked ? "finals" : "titles" }} are not available
    </error-message>
  </u-container>
</template>
