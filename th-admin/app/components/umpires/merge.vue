<script setup>
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()

const { data, status, refresh } = await useFetch("/api/umpires/get-merge", {
  default: () => []
})

const handleMerge = async (id1, id2) => {
  try {
    await $fetch("/api/merge-nodes", {
      query: { type: "Umpire", id1: id1, id2: id2 }
    })
    toast.add({
      title: `Nodes merged`,
      icon: icons["check"],
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error merging nodes`,
      description: e.message,
      icon: icons["error"],
      color: "error"
    })
  }
}
</script>

<template>
  <div>
    <div class="font-semibold">Umpires</div>
    <u-page-list class="*:m-2">
      <div
        v-if="data.length"
        v-for="(result, index) in data"
        :key="`umpire-${index}`"
        class="grid grid-cols-3 w-2xl"
      >
        <div>{{ result.umpire1 }}</div>
        <div>{{ result.umpire2 }}</div>
        <div>
          <u-button
            label="Merge"
            @click="handleMerge(result.umpire1, result.umpire2)"
            :icon="ICONS.merge"
          />
        </div>
      </div>

      <loading v-else-if="status === 'pending'" />

      <div
        v-else
        class="flex flex-col gap-1 items-center"
      >
        <div>No umpires to merge</div>
        <u-button
          label="Refresh"
          @click="refresh()"
          :icon="icons.reload"
        />
      </div>
    </u-page-list>
  </div>
</template>
