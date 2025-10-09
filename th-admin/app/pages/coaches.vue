<script setup lang="ts">
useHead({ title: "Coaches - TH Admin" })
const selectedLetter = ref<string>("Update")

const {
  data: coaches,
  status,
  refresh
} = await useFetch<{ first_name: string; last_name: string; id: string }[]>("/api/coaches/get", {
  query: { letter: selectedLetter },
  default: () => []
})

watch(selectedLetter, () => {
  refresh()
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
            <create-person type="Coach" />
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
        <u-page-list class="*:my-1">
          <edit-person
            v-if="coaches.length"
            v-for="coach in coaches"
            :key="coach.id"
            :person="coach"
            type="Coach"
          />

          <div v-else-if="status === 'pending'">Loading...</div>

          <div
            v-else
            class="flex flex-col gap-1 items-center"
          >
            No coaches found.
            <u-button
              @click="() => refresh()"
              label="Refresh"
              icon="lucide:refresh-ccw"
            />
          </div>
        </u-page-list>
      </template>
    </u-dashboard-panel>
  </div>
</template>
