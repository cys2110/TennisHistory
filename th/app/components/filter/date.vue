<script setup lang="ts" generic="T">
import { CalendarDate, getLocalTimeZone } from "@internationalized/date"

const sorting = defineModel<SortType>("sort")
const dateRange = defineModel<{ start: CalendarDate | undefined; end: CalendarDate | undefined }>("dateRange")

const getIcon = computed(() => {
  const isSorted = sorting.value
  return isSorted === "ASC" ? ICONS.sortNumberUp : isSorted === "DESC" ? ICONS.sortNumberDown : ICONS.sortNumber
})

const sortOptions = computed(() => {
  const isSorted = sorting.value

  return [
    {
      label: "Asc",
      type: "checkbox" as const,
      icon: ICONS.sortNumberUp,
      checked: isSorted === "ASC",
      onSelect: () => (isSorted === "ASC" ? (sorting.value = undefined) : (sorting.value = "ASC"))
    },
    {
      label: "Desc",
      type: "checkbox" as const,
      icon: ICONS.sortNumberDown,
      checked: isSorted === "DESC",
      onSelect: () => (isSorted === "DESC" ? (sorting.value = undefined) : (sorting.value = "DESC"))
    }
  ]
})
</script>

<template>
  <div class="flex justify-center items-center gap-1 w-full">
    <u-dropdown-menu :items="sortOptions">
      <u-button
        color="neutral"
        variant="ghost"
        :icon="getIcon"
        class="-mx-2.5 data-[state=open]:bg-elevated"
      />
    </u-dropdown-menu>
    <u-popover>
      <u-button
        color="neutral"
        variant="link"
        :icon="ICONS.calendar"
      >
        <template v-if="dateRange?.start">
          <template v-if="dateRange?.end">
            {{ shortDateFormat.formatRange(dateRange.start.toDate(getLocalTimeZone()), dateRange.end.toDate(getLocalTimeZone())) }}
          </template>
          <template v-else>
            {{ shortDateFormat.format(dateRange.start.toDate(getLocalTimeZone())) }}
          </template>
        </template>

        <template v-else>Dates</template>
      </u-button>

      <template #content>
        <u-calendar
          v-model="dateRange"
          range
        />
      </template>
    </u-popover>
  </div>
</template>
