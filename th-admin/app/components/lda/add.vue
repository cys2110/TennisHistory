<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui"
import * as z from "zod"

const { refresh } = defineProps<{ refresh: () => void }>()

const {
  params: { id }
} = useRoute("lda")
const toast = useToast()
const {
  ui: { icons }
} = useAppConfig()
const uploading = ref(false)

const { data: entries, status } = await useFetch<any>("/api/entries/get", {
  query: { id },
  default: () => [],
  transform: data =>
    get(useArrayUnique(data, (a: any, b: any) => a.fid === b.fid)).map((e: any) => ({
      id: e.fid,
      label: e.first_name ? `${e.first_name} ${e.last_name}` : e.id
    }))
})

type Schema = z.output<typeof ldaSchema>

const state = reactive<Partial<Schema>>({ eid: id as string })

const formFields: FormFieldInterface<Schema>[] = [
  { label: "Player", key: "id", type: "selectMenu", items: get(entries), loading: get(status) === "pending", required: true },
  { label: "Type", key: "type", type: "select", items: ["Singles", "Doubles"], required: true },
  { label: "Draw", key: "draw", type: "select", items: ["Main", "Qualifying"], required: true },
  { label: "Rank", key: "rank", type: "number" }
]

const onSubmit = async (event: FormSubmitEvent<typeof state>) => {
  set(uploading, true)
  try {
    await $fetch("/api/lda/add", {
      query: event.data
    })
    toast.add({
      title: "LDA created",
      icon: icons.success,
      color: "success"
    })
    refresh()
  } catch (e) {
    toast.add({
      title: "Error creating LDA",
      description: (e as Error).message,
      icon: icons.close,
      color: "error"
    })
  } finally {
    set(uploading, false)
  }
}
</script>

<template>
  <u-form
    :state
    :schema="ldaSchema"
    @submit="onSubmit"
  >
    <div class="grid grid-cols-5 border-b border-muted pb-2 gap-2">
      <form-field
        v-for="field in formFields"
        :key="field.key?.toString()"
        :field="field"
        v-model="state[field.key]"
      />

      <div class="flex items-center">
        <u-button
          type="submit"
          label="Save"
          block
          :icon="uploading ? ICONS.uploading : icons.check"
        />
      </div>
    </div>
  </u-form>
</template>
