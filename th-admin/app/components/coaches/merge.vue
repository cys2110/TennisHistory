<script setup lang="ts">
const toast = useToast()

const { data, status, refresh } = await useFetch<any>("/api/coaches/get-merge", {
  default: () => []
})

const handleMerge = async (id1: number, id2: number) => {
  try {
    await $fetch("/api/merge-nodes", {
      query: { type: "Coach", id1: id1, id2: id2 }
    })
    toast.add({
      title: `Nodes merged`,
      icon: "lucide:circle-check",
      color: "success"
    })
  } catch (e) {
    toast.add({
      title: `Error merging nodes`,
      description: (e as Error).message,
      icon: "lucide:circle-x",
      color: "error"
    })
  }
}
</script>

<template>
  <div>
    <div class="font-semibold">Coaches</div>
    <u-page-list class="*:m-2">
      <div
        v-if="data.length"
        v-for="(result, index) in data"
        :key="`coach-${index}`"
        class="grid grid-cols-4 w-2xl"
      >
        <div>{{ result.coach }}</div>
        <div>{{ result.player }}</div>
        <div>{{ result.player_name }}</div>
        <div>
          <u-button
            label="Merge"
            @click="handleMerge(result.coach, result.player)"
          />
        </div>
      </div>

      <div v-else-if="status === 'pending'">Loading...</div>

      <div
        v-else
        class="flex flex-col gap-1 items-center"
      >
        <div>No coaches to merge</div>
        <u-button
          label="Refresh"
          @click="refresh()"
          icon="lucide:refresh-ccw"
        />
      </div>
    </u-page-list>
  </div>
</template>
