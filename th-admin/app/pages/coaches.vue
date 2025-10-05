<script setup lang="ts">
useHead({ title: "Coaches - TH Admin" })
const selectedLetter = ref<string>("Update")

const {
  data: coaches,
  status,
  refresh
} = await useFetch<{ first_name: string; last_name: string; id: string }[]>("/api/get-coaches", {
  query: { letter: selectedLetter },
  default: () => []
})

const toc = computed(() => [
  {
    id: "coaches",
    label: "Coaches",
    items: coaches.value.map(coach => ({
      label: coach.first_name ? `${coach.first_name} ${coach.last_name}` : coach.id,
      to: `#${coach.id}`
    }))
  }
])
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar title="Coaches">
          <template #right>
            <create-coach />
            <u-popover>
              <u-button
                icon="lucide:table-of-contents"
                size="sm"
                class="mx-2"
              />
              <template #content>
                <u-command-palette
                  placeholder="Search coaches"
                  :groups="toc"
                  :loading="status === 'pending'"
                  :ui="{ content: 'max-h-80', root: 'border border-primary rounded-lg' }"
                />
              </template>
            </u-popover>
          </template>
        </u-dashboard-navbar>
        <u-dashboard-toolbar>
          <u-select-menu
            v-model="selectedLetter"
            :items="[
              'Update',
              'A',
              'B',
              'C',
              'D',
              'E',
              'F',
              'G',
              'H',
              'I',
              'J',
              'K',
              'L',
              'M',
              'N',
              'O',
              'P',
              'Q',
              'R',
              'S',
              'T',
              'U',
              'V',
              'W',
              'X',
              'Y',
              'Z'
            ]"
          />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <div v-if="['idle', 'pending'].includes(status)">Loading...</div>

        <u-page-list
          v-else-if="coaches.length"
          class="*:my-2"
        >
          <edit-coach
            v-for="coach in coaches"
            :key="coach.id"
            :coach
          />
        </u-page-list>

        <div v-else>
          Error loading coaches.
          <u-button
            @click="() => refresh()"
            label="Refresh"
            icon="lucide:refresh-ccw"
          />
        </div>
      </template>
    </u-dashboard-panel>
  </div>
</template>
