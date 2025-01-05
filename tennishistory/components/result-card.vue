<script setup lang="ts">
const props = defineProps<{ match: EventResultsMatchType }>();
const route = useRoute();
const { tname, tid, year, eid } = route.params;
const { court, date, duration, incomplete, loser_country, loser_id, loser_incomplete, loser_name, loser_seed, loser_status, mid, ws1, ws2, ws3, ws4, ws5, wt1, wt2, wt3, wt4, wt5, ls1, ls2, ls3, ls4, ls5, lt1, lt2, lt3, lt4, lt5, umpire, winner_country, winner_id, winner_name, winner_seed, winner_status } = props.match;
</script>

<template>
    <shadcn-card class="full-card pt-3 px-3">
        <shadcn-card-header>
            <shadcn-card-title class="flex justify-between text-xs md:text-sm lg:text-xs xl:text-sm text-zinc-500 dark:text-zinc-400 px-5">
                <div class="flex flex-col">
                    <div v-if="date">{{ date }}</div>
                    <div v-if="court">{{ court }}</div>
                </div>
                <div class="flex flex-col">
                    <div class="text-right">{{ duration ?? "0:00" }}</div>
                    <div
                        v-if="umpire"
                        class="text-right"
                    >
                        {{ umpire }}
                    </div>
                </div>
            </shadcn-card-title>
        </shadcn-card-header>
        <shadcn-card-content class="grid grid-cols-9 items-center gap-1 text-xs md:text-sm lg:text-xs xl:text-sm text-zinc-600 dark:text-zinc-300">
            <div class="flex justify-center items-center">
                <Icon
                    v-if="getCountryCode(winner_country)"
                    :name="`flag:${getCountryCode(winner_country)}-4x3`"
                    class="text-base"
                />
                <component
                    v-else
                    :is="`Icons${winner_country}`"
                />
            </div>
            <div class="flex justify-center items-center">
                <shadcn-avatar
                    class="border border-zinc-400"
                    size="sm"
                >
                    <shadcn-avatar-image
                        :src="`https://www.atptour.com/-/media/alias/player-headshot/${winner_id}`"
                        :alt="winner_name"
                    />
                    <shadcn-avatar-fallback>
                        <Icon name="material-symbols:person-rounded" />
                    </shadcn-avatar-fallback>
                </shadcn-avatar>
            </div>
            <div class="col-span-3 flex items-center">
                <nuxt-link
                    class="hover-link"
                    :to="`/players/${encodeName(winner_name)}/${winner_id}`"
                >
                    {{ winner_name }}
                </nuxt-link>
            </div>
            <div class="flex justify-center items-center">
                <span v-if="winner_seed || winner_status">({{ winner_seed }}{{ winner_status }})</span>
            </div>
            <div class="flex justify-center items-center">
                <Icon
                    name="ic:twotone-check-circle"
                    class="text-green-600"
                />
            </div>
            <div class="col-span-2 flex justify-end gap-2">
                <span v-if="ws1">
                    {{ ws1 }}<sup v-if="wt1">{{ wt1 }}</sup>
                </span>
                <span v-if="ws2">
                    {{ ws2 }}<sup v-if="wt2">{{ wt2 }}</sup>
                </span>
                <span v-if="ws3">
                    {{ ws3 }}<sup v-if="wt3">{{ wt3 }}</sup>
                </span>
                <span v-if="ws4">
                    {{ ws4 }}<sup v-if="wt4">{{ wt4 }}</sup>
                </span>
                <span v-if="ws5">
                    {{ ws5 }}<sup v-if="wt5">{{ wt5 }}</sup>
                </span>
            </div>
            <div class="flex justify-center items-center">
                <Icon
                    v-if="loser_country && getCountryCode(loser_country)"
                    :name="`flag:${getCountryCode(loser_country)}-4x3`"
                    class="text-base"
                />
                <component
                    v-else-if="loser_country"
                    :is="`Icons${loser_country}`"
                />
            </div>
            <div class="flex justify-center items-center">
                <shadcn-avatar
                    class="border border-zinc-400"
                    size="sm"
                >
                    <shadcn-avatar-image
                        :src="`https://www.atptour.com/-/media/alias/player-headshot/${loser_id}`"
                        :alt="loser_name"
                    />
                    <shadcn-avatar-fallback>
                        <Icon name="material-symbols:person-rounded" />
                    </shadcn-avatar-fallback>
                </shadcn-avatar>
            </div>
            <div class="col-span-3 flex items-center">
                <nuxt-link
                    v-if="loser_name"
                    class="hover-link"
                    :to="`/players/${encodeName(loser_name)}/${loser_id}`"
                >
                    {{ loser_name }}
                </nuxt-link>
                <div v-else>BYE</div>
            </div>
            <div class="flex justify-center items-center">
                <small v-if="loser_seed || loser_status">({{ loser_seed }}{{ loser_status }})</small>
            </div>
            <div class="flex justify-center items-center">
                <shadcn-badge
                    v-if="loser_incomplete"
                    class="bg-red-800"
                    variant="outline"
                >
                    {{ `${loser_incomplete}.` }}
                </shadcn-badge>
            </div>
            <div class="col-span-2 flex justify-end gap-2">
                <span v-if="ls1">
                    {{ ls1 }}<sup v-if="lt1">{{ lt1 }}</sup>
                </span>
                <span v-if="ls2">
                    {{ ls2 }}<sup v-if="lt2">{{ lt2 }}</sup>
                </span>
                <span v-if="ls3">
                    {{ ls3 }}<sup v-if="lt3">{{ lt3 }}</sup>
                </span>
                <span v-if="ls4">
                    {{ ls4 }}<sup v-if="lt4">{{ lt4 }}</sup>
                </span>
                <span v-if="ls5">
                    {{ ls5 }}<sup v-if="lt5">{{ lt5 }}</sup>
                </span>
            </div>
        </shadcn-card-content>
        <shadcn-card-footer class="flex justify-evenly">
            <shadcn-button
                v-if="incomplete"
                disabled
                size="xs"
                class="rounded-full"
            >
                <Icon name="material-symbols:query-stats-rounded" />
                Stats
            </shadcn-button>
            <shadcn-button
                v-else
                size="xs"
                class="rounded-full"
                as-child
            >
                <div>
                    <Icon name="material-symbols:query-stats-rounded" />
                    <nuxt-link
                        class="hover-link"
                        :to="`/tournaments/${tname}/${tid}/${year}/${eid}/${mid}`"
                    >
                        Stats
                    </nuxt-link>
                </div>
            </shadcn-button>
            <shadcn-button
                v-if="!loser_name"
                disabled
                size="xs"
                class="rounded-full"
            >
                <Icon name="material-symbols:swords-outline-rounded" />
                H2H
            </shadcn-button>
            <shadcn-button
                v-else
                size="xs"
                class="rounded-full"
                as-child
            >
                <div>
                    <Icon name="material-symbols:swords-outline-rounded" />
                    <nuxt-link
                        class="hover-link"
                        :to="`/h2h/${encodeName(winner_name)}-v-${encodeName(loser_name)}/${winner_id}-${loser_id}`"
                    >
                        H2H
                    </nuxt-link>
                </div>
            </shadcn-button>
        </shadcn-card-footer>
    </shadcn-card>
</template>
