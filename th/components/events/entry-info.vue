<script setup lang="ts">
const toast = useToast()
const eid = useRouteParams<string>("eid")
const formatName = useFormatName()

// API call
const { data } = await useFetch<EventEntryInfoType[]>("/api/eventEntryInfo", {
  query: { eid: eid.value },
  onResponseError: () => {
    toast.add({
      title: "Error fetching entry info",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-container
    v-if="data"
    class="border-3 border-violet-400 rounded-xl p-4"
  >
    <div class="flex justify-between items-center my-2">
      <div class="text-slate-500 dark:text-slate-400 font-bold text-xl">Entry Information</div>
      <u-modal
        fullscreen
        class="hidden md:flex"
        title="Entry Information"
      >
        <u-button
          :icon="ICONS.tree"
          variant="subtle"
          color="secondary"
          :ui="{ leadingIcon: 'rotate-270' }"
        />
        <template #body>
          <entry-info-chart :data />
        </template>
      </u-modal>
    </div>

    <u-collapsible
      v-for="item in data"
      :key="item.label"
      :ui="{ content: 'px-4' }"
    >
      <u-button
        class="group my-2"
        :label="item.label"
        color="neutral"
        variant="subtle"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        block
        :trailing-icon="ICONS['chevron-down']"
      />

      <template #content>
        <div class="flex flex-col gap-2">
          <div
            v-for="player in item.content"
            class="flex justify-between items-center"
          >
            <player-avatar :player="player" />
            <div
              v-if="player.rank || player.reason"
              class="text-sm"
            >
              {{ player.status && item.label === "Last direct acceptance" ? "P" : "" }}{{ player.rank ?? player.reason }}
            </div>
          </div>
        </div>
      </template>
    </u-collapsible>
  </u-container>
  <error-message
    v-else
    :icon="ICONS['no-info']"
    :title="`No entry information available for ${formatName.capitaliseName.value}`"
  />
</template>
