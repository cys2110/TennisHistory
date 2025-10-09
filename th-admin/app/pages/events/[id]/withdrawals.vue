<script setup>
definePageMeta({ name: "withdrawals" })

const {
  params: { id }
} = useRoute("withdrawals")
useHead({ title: () => `${id} Withdrawals - TH Admin` })
const addWithdrawals = ref([])

const { data: entries, status } = await useFetch("/api/withdrawals/get", {
  query: { id },
  default: () => []
})

function handleAddWithdrawal() {
  addWithdrawals.value.push(Date.now())
}
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar :title="`Withdrawals - ${id}`">
          <template #right>
            <u-dropdown-menu :items="routes">
              <u-button
                icon="lucide:layers-3"
                size="sm"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-button
            label="Add Withdrawal"
            @click="handleAddWithdrawal"
            block
            size="sm"
            icon="lucide:square-plus"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <client-only>
          <withdrawals-add
            v-for="n in addWithdrawals"
            :key="`add-withdrawal-${n}`"
          />
        </client-only>
        <withdrawals-edit
          v-if="entries.length"
          v-for="(entry, index) in entries"
          :key="`withdrawal-${index}`"
          :entry
        />
        <div v-else-if="status === 'pending'">Loading...</div>
        <div
          v-else
          class="flex flex-col gap-1 items-center"
        >
          <div>No entries found.</div>
          <u-button
            label="Refresh"
            @click="() => reloadNuxtApp()"
            icon="lucide:refresh-ccw"
          />
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
