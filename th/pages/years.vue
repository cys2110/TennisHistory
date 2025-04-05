<script setup lang="ts">
definePageMeta({ name: "years" })
const toast = useToast()
const id = useRouteQuery<string>("year", new Date().getFullYear().toString())
useHead({ title: id.value, templateParams: { subPage: "Years" } })

interface YearAPIResponse {
  established_tournaments: Pick<TournamentInterface, "id" | "name">[]
  abolished_tournaments: Pick<TournamentInterface, "id" | "name">[]
  pro_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  retired_players: Pick<PlayerInterface, "id" | "name" | "country">[]
}

const { data: year, status } = await useFetch<YearAPIResponse>("/api/year-details", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching year details for ${id.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: id.value, icon: ICONS.year }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #toolbar>
        <years-all-select v-model="id" />
      </template>

      <u-page-grid
        v-if="year"
        class="xl:grid-cols-4 2xl:grid-cols-4"
      >
        <u-collapsible v-if="year.established_tournaments">
          <u-button
            class="group my-2"
            label="Tournaments established"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2">
              <tournament-link
                v-for="tournament in year.established_tournaments"
                :key="tournament.id"
                :name="tournament.name"
                :id="tournament.id"
                class="text-sm w-fit"
              />
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.abolished_tournaments">
          <u-button
            class="group my-2"
            label="Tournaments abolished"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2">
              <tournament-link
                v-for="tournament in year.abolished_tournaments"
                :key="tournament.id"
                :name="tournament.name"
                :id="tournament.id"
                class="text-sm w-fit"
              />
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.pro_players">
          <u-button
            class="group my-2"
            label="Players who turned pro"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2">
              <player-avatar
                v-for="player in year.pro_players"
                :key="player.id"
                :player
              />
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.retired_players">
          <u-button
            class="group my-2"
            label="Players who retired"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2">
              <player-avatar
                v-for="player in year.retired_players"
                :key="player.id"
                :player
              />
            </div>
          </template>
        </u-collapsible>
      </u-page-grid>

      <error-message
        v-else
        :title="`No details found for ${id}`"
        :icon="ICONS.noCalendar"
        :status
      />
    </nuxt-layout>
  </div>
</template>
