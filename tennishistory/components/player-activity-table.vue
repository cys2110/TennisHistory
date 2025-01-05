<script setup lang="ts">
const props = defineProps<{ event: PlayerActivityType; year: string }>();
const route = useRoute();
const id = computed(() => route.params.pid);
const name = computed(() => route.params.pname);

const columns = [
    { header: "Round", span: 1 },
    { header: "Player", span: 3 },
    { header: "Rank", span: 1 },
    { header: "Score", span: 2 },
    { header: "", span: 1 }
];
</script>

<template>
    <shadcn-table class="w-full mx-auto mt-5 mb-3">
        <shadcn-table-header>
            <shadcn-table-row class="border-t border-zinc-500">
                <shadcn-table-head
                    v-for="column in columns"
                    :key="column.header"
                    class="text-center"
                    :colspan="column.span"
                >
                    {{ column.header }}
                </shadcn-table-head>
            </shadcn-table-row>
        </shadcn-table-header>
        <shadcn-table-body>
            <shadcn-table-row
                v-for="match in event.matches"
                :key="match.match_no"
                class="border-zinc-500"
            >
                <shadcn-table-cell class="text-center">{{ SHORT_ROUNDS[match.round as keyof typeof SHORT_ROUNDS] }}</shadcn-table-cell>
                <shadcn-table-cell class="text-center">
                    <Icon
                        v-if="match.name && getCountryCode(match.country)"
                        :name="`flag:${getCountryCode(match.country)}-4x3`"
                        class="text-xl rounded border border-zinc-400"
                    />
                    <component
                        v-else
                        :is="`Icons${match.country}`"
                    />
                </shadcn-table-cell>
                <shadcn-table-cell>
                    <shadcn-avatar class="border border-zinc-400">
                        <shadcn-avatar-image
                            :src="`https://www.atptour.com/-/media/alias/player-headshot/${match.id}`"
                            :alt="match.name"
                            size="sm"
                        />
                        <shadcn-avatar-fallback>
                            <Icon name="material-symbols:person-rounded" />
                        </shadcn-avatar-fallback>
                    </shadcn-avatar>
                </shadcn-table-cell>
                <shadcn-table-cell>
                    <div
                        v-if="match.name"
                        class="flex gap-2"
                    >
                        <nuxt-link
                            class="hover-link"
                            :to="`/players/${encodeName(match.name)}/${match.id}`"
                        >
                            {{ match.name }}
                        </nuxt-link>
                        <small v-if="match.seed || match.status">({{ match.seed }}{{ match.status }})</small>
                    </div>
                    <template v-else-if="match.incomplete === 'B'">BYE</template>
                    <template v-else>TBD</template>
                </shadcn-table-cell>
                <shadcn-table-cell class="text-center">{{ match.rank }}</shadcn-table-cell>
                <shadcn-table-cell>
                    <Icon
                        v-if="match.winner === match.id"
                        name="charm:circle-cross"
                        class="text-red-600"
                    />
                    <Icon
                        v-else-if="match.winner"
                        name="ic:twotone-check-circle"
                        class="text-green-600"
                    />
                </shadcn-table-cell>
                <shadcn-table-cell>
                    <nuxt-link
                        v-if="match.name"
                        class="hover-link flex gap-1"
                        :to="`/tournaments/${encodeName(event.name)}/${event.tid}/${year}/${event.eid}/${match.match_no}`"
                    >
                        <span v-if="match.s1">
                            {{ match.s1 }}<sup v-if="match.t1">{{ match.t1 }}</sup>
                        </span>
                        <span v-if="match.s2">
                            {{ match.s2 }}<sup v-if="match.t2">{{ match.t2 }}</sup>
                        </span>
                        <span v-if="match.s3">
                            {{ match.s3 }}<sup v-if="match.t3">{{ match.t3 }}</sup>
                        </span>
                        <span v-if="match.s4">
                            {{ match.s4 }}<sup v-if="match.t4">{{ match.t4 }}</sup>
                        </span>
                        <span v-if="match.s5">
                            {{ match.s5 }}<sup v-if="match.t5">{{ match.t5 }}</sup>
                        </span>
                    </nuxt-link>
                </shadcn-table-cell>
                <shadcn-table-cell>
                    <shadcn-button
                        v-if="match.name"
                        size="sm"
                        as-child
                    >
                        <div>
                            <Icon name="material-symbols:swords-outline-rounded" />
                            <nuxt-link :to="`/h2h/${name}-v-${encodeName(match.name)}/${id}-${match.id}`"> H2H </nuxt-link>
                        </div>
                    </shadcn-button>
                </shadcn-table-cell>
            </shadcn-table-row>
        </shadcn-table-body>
    </shadcn-table>
</template>
