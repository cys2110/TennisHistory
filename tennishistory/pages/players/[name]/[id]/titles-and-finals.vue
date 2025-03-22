<script setup lang="ts">
definePageMeta({ name: "titles-and-finals", layout: "dashboard-layout" })
const id = useRouteParams<string>("id")
const toast = useToast()
const formatName = useFormatName()
const checked = ref(false)

// API call
const { data } = await useFetch<TitlesAndFinalsType>("/api/titles-and-finals", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${formatName.capitaliseName.value}'s titles and finals`
    })
  }
})
</script>

<template>
  <player-wrapper>
    <template #toolbar-right>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS['no-trophy']"
        :unchecked-icon="ICONS.trophy"
        :label="checked ? 'Finals' : 'Titles'"
      />
    </template>

    <titles-stepper
      v-if="data && checked && data.finals.length > 0"
      :events="data.finals"
    />

    <titles-stepper
      v-else-if="data && data.titles.length > 0"
      :events="data.titles"
    />

    <error-message
      v-else
      :icon="ICONS['no-trophy']"
      :title="checked ? `${formatName.capitaliseName.value} has not played any finals` : `${formatName.capitaliseName.value} has not won any titles`"
    />
  </player-wrapper>
</template>
