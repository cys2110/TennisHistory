<script setup lang="ts">
const props = defineProps<{ event: TournamentEventType }>();
const { eid, loser_country, loser_name, loser_id, winner_country, winner_name, winner_id, year, match_no, ...event } = props.event;
const route = useRoute();
const tname = computed(() => route.params.tname);
const tid = computed(() => route.params.tid);

// Get country codes for icons
const winnerCountryCode = getCountryCode(winner_country);
const loserCountryCode = getCountryCode(loser_country);
</script>

<template>
    <shadcn-card class="full-card">
        <shadcn-card-header>
            <shadcn-card-title>
                <nuxt-link
                    class="hover-link font-bold text-lg"
                    :to="`/tournaments/${tname}/${tid}/${year}/${eid}`"
                >
                    {{ year }}
                </nuxt-link>
            </shadcn-card-title>
            <shadcn-separator class="my-2" />
        </shadcn-card-header>
        <shadcn-card-content>
            <div class="w-11/12 mx-auto flex flex-col gap-y-3 justify-center text-sm">
                <div class="flex gap-3 items-center md:w-2/3 2xl:w-5/6 mx-auto">
                    <Icon
                        v-if="winnerCountryCode"
                        :name="`flag:${winnerCountryCode}-4x3`"
                        class="text-lg rounded border border-zinc-400"
                    />
                    <component
                        v-else
                        :is="`Icons${winner_country}`"
                    />
                    <shadcn-avatar class="border border-zinc-400">
                        <shadcn-avatar-image
                            :src="`https://www.atptour.com/-/media/alias/player-headshot/${winner_id}`"
                            :alt="winner_name"
                            size="sm"
                        />
                        <shadcn-avatar-fallback>
                            <Icon name="material-symbols:person-rounded" />
                        </shadcn-avatar-fallback>
                    </shadcn-avatar>
                    <nuxt-link
                        class="hover-link col-span-3 ml-2"
                        :to="`/players/${encodeName(winner_name)}/${winner_id}`"
                    >
                        {{ winner_name }}
                    </nuxt-link>
                </div>
                <div class="col-span-5 text-center text-zinc-400">d.</div>
                <div class="flex gap-3 items-center md:w-2/3 2xl:w-5/6 mx-auto">
                    <Icon
                        v-if="loserCountryCode"
                        :name="`flag:${loserCountryCode}-4x3`"
                        class="text-lg rounded border border-zinc-400"
                    />
                    <component
                        v-else
                        :is="`Icons${loser_country}`"
                    />
                    <shadcn-avatar class="border border-zinc-400">
                        <shadcn-avatar-image
                            :src="`https://www.atptour.com/-/media/alias/player-headshot/${loser_id}`"
                            :alt="loser_name"
                        />
                        <shadcn-avatar-fallback>
                            <Icon name="material-symbols:person-rounded" />
                        </shadcn-avatar-fallback>
                    </shadcn-avatar>
                    <nuxt-link
                        class="hover-link col-span-3 ml-2"
                        :to="`/players/${encodeName(loser_name)}/${loser_id}`"
                    >
                        {{ loser_name }}
                    </nuxt-link>
                </div>
            </div>
        </shadcn-card-content>
        <shadcn-card-footer class="flex justify-center items-center">
            <nuxt-link
                class="hover-link text-sm flex gap-1"
                :to="`/tournaments/${tname}/${tid}/${year}/${eid}/${match_no}`"
            >
                <template
                    v-for="(_, index) in new Array(5)"
                    :key="index"
                >
                    <span v-if="(event as any)[`s${index + 1}`]">
                        {{ (event as any)[`s${index + 1}`] }}
                        <sup v-if="(event as any)[`t${index + 1}`]">{{ (event as any)[`t${index + 1}`] }}</sup>
                    </span>
                </template>
            </nuxt-link>
        </shadcn-card-footer>
    </shadcn-card>
</template>
