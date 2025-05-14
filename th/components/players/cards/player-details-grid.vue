<script setup lang="ts">
const { playerDetails, status, coaches, countries } = defineProps<{
  playerDetails: ({
    title: string
    value: string | number | null
  } | null)[]
  status: APIStatusType
  coaches: PlayerDetailsType["coaches"]
  countries: PlayerDetailsType["countries"]
}>()

const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))
const currentYear = new Date().getFullYear()
</script>

<template>
  <div v-if="playerDetails.length">
    <u-page-columns class="lg:columns-2 xl:columns-3 2xl:columns-3">
      <!--@vue-expect-error-->
      <details-card
        v-for="detail in playerDetails"
        :key="detail?.title"
        :detail
      />
      <u-page-card
        :title="coaches.length === 1 ? 'Coach' : 'Coaches'"
        highlight
      >
        <template #description>
          <base-link
            v-if="coaches.length"
            v-for="coach in coaches"
            :key="coach.id"
            :id="coach.id"
            type="coach"
          >
            {{ coach.name ?? coach.id }}
          </base-link>
          <template v-else>—</template>
        </template>
      </u-page-card>
    </u-page-columns>
    <u-page-card
      v-if="countries.length"
      class="mt-10"
      title="Previous Representations"
      highlight
    >
      <template #description>
        <div
          v-for="country in countries"
          :key="country.id"
          class="grid grid-cols-9 items-center my-2"
        >
          <base-link
            type="country"
            :country
          />
          <u-link
            class="hover-link w-fit col-span-4"
            :to="{ name: 'country', params: { id: country.id } }"
          >
            {{ country.name }}
          </u-link>
          <span class="col-span-4">{{ country.dates }}</span>
        </div>
      </template>
    </u-page-card>
  </div>
  <u-page-columns
    v-else-if="['pending', 'idle'].includes(status)"
    class="lg:columns-2 xl:columns-3 2xl:columns-3"
  >
    <base-loading-card
      v-for="_ in 10"
      :key="_"
    />
  </u-page-columns>
  <error-message
    v-else
    :icon="ICONS.noPlayer"
    :message="`No details found for ${name}`"
  />
</template>
