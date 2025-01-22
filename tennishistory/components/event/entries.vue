<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const checked = ref(false)

const { data: entries, status } = await useFetch<EventEntryType[]>("/api/eventEntries", {
  query: { eid: route.params.eid },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container v-if="entries">
    <div class="flex justify-between items-center">
      <div>Entries</div>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS.cards"
        :unchecked-icon="ICONS.table"
      />
    </div>
    <!--TODO: skeleton loader-->
    <entries-cards
      v-if="checked"
      :entries
    />
    <entries-table
      v-else
      :entries
    />
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
  >
    No entries found
  </error-message>
</template>
