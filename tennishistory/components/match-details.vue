<script setup lang="ts">
const props = defineProps<{ match: MatchType }>();
const { date, dates, surface, court, duration, umpire, p1, winner, p2 } = props.match;

const fieldsetItems = [
    { label: "Date(s)", value: date ?? dates },
    { label: "Surface", value: surface ?? "—" },
    { label: "Court", value: court ?? "—" },
    { label: "Duration", value: duration ?? "—" },
    { label: "Umpire", value: umpire ?? "—" }
];
</script>

<template>
    <shadcn-tabs-content :value="0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 mt-5">
            <prime-fieldset
                v-for="item in fieldsetItems"
                :key="item.label"
                :legend="item.label"
                >{{ item.value }}</prime-fieldset
            >
        </div>
        <prime-fieldset
            legend="Score"
            class="w-1/2 mx-auto"
        >
            <div class="grid grid-cols-8 gap-3 items-center">
                <div>
                    <Icon
                        v-if="getCountryCode(p1.country)"
                        :name="`flag:${getCountryCode(p1.country)}-4x3`"
                        class="text-base rounded border border-zinc-400"
                    />
                    <component
                        v-else
                        :is="`Icons${p1.country}`"
                    />
                </div>
                <div>
                    <shadcn-avatar
                        class="border border-zinc-400"
                        size="sm"
                    >
                        <shadcn-avatar-image
                            :src="`https://www.atptour.com/-/media/alias/player-headshot/${p1.id}`"
                            :alt="p1.name"
                        />
                        <shadcn-avatar-fallback>
                            <Icon name="material-symbols:person-rounded" />
                        </shadcn-avatar-fallback>
                    </shadcn-avatar>
                </div>
                <div class="col-span-2">
                    {{ p1.name }}
                    <small v-if="p1.seed || p1.status">({{ p1.seed }}{{ p1.status }})</small>
                </div>
                <div>({{ p1.rank }})</div>
                <div>
                    <Icon
                        v-if="winner === p1.id"
                        name="ic:twotone-check-circle"
                        class="text-green-600"
                    />
                    <shadcn-badge
                        v-else-if="p1.incomplete"
                        class="bg-red-800"
                    >
                        {{ p1.incomplete }}.
                    </shadcn-badge>
                </div>
                <div class="col-span-2 flex gap-2 justify-end">
                    <span v-if="p1.s1">
                        {{ p1.s1 }}
                        <sup v-if="p1.t1">{{ p1.t1 }}</sup>
                    </span>
                    <span v-if="p1.s2">
                        {{ p1.s2 }}
                        <sup v-if="p1.t2">{{ p1.t2 }}</sup>
                    </span>
                    <span v-if="p1.s3">
                        {{ p1.s3 }}
                        <sup v-if="p1.t3">{{ p1.t3 }}</sup>
                    </span>
                    <span v-if="p1.s4">
                        {{ p1.s4 }}
                        <sup v-if="p1.t4">{{ p1.t4 }}</sup>
                    </span>
                    <span v-if="p1.s5">
                        {{ p1.s5 }}
                        <sup v-if="p1.t5">{{ p1.t5 }}</sup>
                    </span>
                </div>
                <div>
                    <Icon
                        v-if="getCountryCode(p2.country)"
                        :name="`flag:${getCountryCode(p2.country)}-4x3`"
                        class="text-base rounded border border-zinc-400"
                    />
                    <component
                        v-else
                        :is="`Icons${p2.country}`"
                    />
                </div>
                <div>
                    <shadcn-avatar
                        class="border border-zinc-400"
                        size="sm"
                    >
                        <shadcn-avatar-image
                            :src="`https://www.atptour.com/-/media/alias/player-headshot/${p2.id}`"
                            :alt="p2.name"
                        />
                        <shadcn-avatar-fallback>
                            <Icon name="material-symbols:person-rounded" />
                        </shadcn-avatar-fallback>
                    </shadcn-avatar>
                </div>
                <div class="col-span-2">
                    {{ p2.name }}
                    <small v-if="p2.seed || p2.status">({{ p2.seed }}{{ p2.status }})</small>
                </div>
                <div>({{ p2.rank }})</div>
                <div>
                    <Icon
                        v-if="winner === p2.id"
                        name="ic:twotone-check-circle"
                        class="text-green-600"
                    />
                    <shadcn-badge
                        v-else-if="p2.incomplete"
                        class="bg-red-800"
                    >
                        {{ p2.incomplete }}.
                    </shadcn-badge>
                </div>
                <div class="col-span-2 flex gap-2 justify-end">
                    <span v-if="p2.s1">
                        {{ p2.s1 }}
                        <sup v-if="p2.t1">{{ p2.t1 }}</sup>
                    </span>
                    <span v-if="p2.s2">
                        {{ p2.s2 }}
                        <sup v-if="p2.t2">{{ p2.t2 }}</sup>
                    </span>
                    <span v-if="p2.s3">
                        {{ p2.s3 }}
                        <sup v-if="p2.t3">{{ p2.t3 }}</sup>
                    </span>
                    <span v-if="p2.s4">
                        {{ p2.s4 }}
                        <sup v-if="p2.t4">{{ p2.t4 }}</sup>
                    </span>
                    <span v-if="p2.s5">
                        {{ p2.s5 }}
                        <sup v-if="p2.t5">{{ p2.t5 }}</sup>
                    </span>
                </div>
            </div>
        </prime-fieldset>
    </shadcn-tabs-content>
</template>
