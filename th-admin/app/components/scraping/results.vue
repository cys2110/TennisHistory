<script setup>
const {
  ui: { icons }
} = useAppConfig()

const open = ref(false)
const toast = useToast()
const links = ref([])
const scraping = ref(false)

defineShortcuts({
  meta_shift_r: () => set(open, !get(open))
})

const state = reactive({
  year: new Date().getFullYear(),
  type: "Singles"
})

const formFields = [
  { label: "DB ID", key: "tid", type: "text", subType: "number", required: true },
  { label: "Source ID", key: "tid2", type: "text", subType: "number" },
  { label: "Year Slug", key: "year", type: "text", subType: "number", required: true },
  { label: "Year", key: "year2", type: "text", subType: "number" },
  { label: "Match Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true }
]

const onSubmit = async event => {
  set(scraping, true)
  try {
    const response = await $fetch("http://127.0.0.1:5001/atp_results", {
      method: "POST",
      timeout: 120_000,
      "Content-Type": "application/json",
      body: JSON.stringify(event.data)
    })
    if (response.ok) {
      toast.add({
        title: "Results scraped",
        icon: icons.success,
        color: "success"
      })
      links.value = response.links

      const blob = new Blob([JSON.stringify(response, null, 2)], {
        type: "application/json"
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "atp_results.json"
      a.click()
      URL.revokeObjectURL(url)
      set(open, false)
    } else {
      toast.add({
        title: "Error scraping results",
        icon: icons.error,
        color: "error"
      })
    }
  } catch (e) {
    console.error(e)
    toast.add({
      title: "Error scraping results",
      icon: icons.error,
      color: "error"
    })
  } finally {
    set(scraping, false)
  }
}
</script>

<template>
  <u-modal
    title="Scrape Results"
    v-model:open="open"
  >
    <u-button
      label="Scrape results"
      :icon="scraping ? ICONS.downloading : ICONS.download"
      block
    />

    <template #body>
      <u-form
        id="results-form"
        :schema="scrapeEventSchema"
        :state
        @submit="onSubmit"
      >
        <div class="grid grid-cols-2 gap-2">
          <form-field
            v-for="field in formFields"
            :key="field.key"
            :field="field"
            v-model="state[field.key]"
          />
        </div>
      </u-form>
    </template>

    <template #footer="{ close }">
      <u-button
        form="results-form"
        type="submit"
        label="Scrape"
        :icon="scraping ? ICONS.downloading : ICONS.download"
        block
      />
      <u-button
        label="Cancel"
        color="error"
        @click="close"
        :icon="icons.close"
        block
      />
    </template>
  </u-modal>
</template>
