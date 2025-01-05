<script setup lang="ts">
const props = defineProps<{ event: PlayerActivityType; year: string }>();

const earnings = {
    Seed: props.event.seed,
    Status: props.event.status,
    Points: props.event.points,
    Rank: props.event.rank,
    "Prize Money": `${CURRENCIES[props.event.currency as keyof typeof CURRENCIES]}${props.event.pm}`
};

const tagColors = {
    Seed: "bg-orange-500 text-orange-800",
    Status: "bg-fuchsia-500 text-fuchsia-800",
    Points: "bg-teal-500 text-teal-800",
    Rank: "bg-blue-500 text-blue-800",
    "Prize Money": "bg-emerald-500 text-emerald-800"
};

// Get country code for icons
const countryCode = getCountryCode(props.event.country);
</script>

<template>
    <shadcn-card
        :id="event.eid"
        class="w-full px-12 pt-5 mt-10"
    >
        <shadcn-card-header>
            <shadcn-card-title class="flex justify-between">
                <span>
                    <nuxt-link
                        class="hover-link font-bold"
                        :to="`/tournaments/${encodeName(event.name)}/${event.tid}`"
                    >
                        {{ event.name }}
                    </nuxt-link>
                </span>
                <span
                    v-if="event.ename"
                    class="text-zinc-400"
                    >{{ event.ename }}</span
                >
            </shadcn-card-title>
            <shadcn-card-description class="flex justify-between">
                <div>
                    <span>{{ event.start }}-{{ event.end }}</span>
                    <span>&nbsp;| {{ event.city }}</span>
                    <span class="ml-3">
                        <Icon
                            v-if="countryCode"
                            :name="`flag:${countryCode}-4x3`"
                        />
                        <component
                            v-else
                            :is="event.country"
                        />
                    </span>
                </div>
                <div>{{ event.surface }}</div>
            </shadcn-card-description>
        </shadcn-card-header>
        <shadcn-card-content>
            <player-activity-table
                :event
                :year
            />
        </shadcn-card-content>
        <shadcn-card-footer class="flex justify-between">
            <div class="flex gap-1 text-center items-center">
                <template
                    v-for="(value, key) in earnings"
                    :key
                >
                    <shadcn-badge
                        v-if="value"
                        variant="outline"
                        :class="tagColors[key]"
                    >
                        {{ key }}: {{ value }}
                    </shadcn-badge>
                </template>
            </div>
            <div class="flex gap-1">
                <shadcn-button
                    v-for="button in EVENT_PAGES"
                    :key="button.title"
                    class="rounded-full"
                    size="xs"
                    as-child
                >
                    <div>
                        <Icon :name="button.icon" />
                        <nuxt-link
                            class="hover-link"
                            :to="`/tournaments/${encodeName(event.name)}/${event.tid}/${year}/${event.eid}/${button.route}`"
                        >
                            {{ button.title }}
                        </nuxt-link>
                    </div>
                </shadcn-button>
            </div>
        </shadcn-card-footer>
    </shadcn-card>
</template>
