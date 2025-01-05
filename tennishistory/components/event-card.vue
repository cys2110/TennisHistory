<script setup lang="ts">
const props = defineProps<{ event: EventCardType }>();
const { surface, country, city, tname, tid, ename, year, eid, start, dates, category } = props.event;

// Disabled buttons if event has not started yet
const startDate = new Date(start);
const currentDate = new Date();
const isDisabled = currentDate < startDate;

// Get country code for icons
const countryCode = getCountryCode(country);

// Route params
const tournamentName = computed(() => encodeName(tname));
</script>

<template>
    <shadcn-card
        class="full-card"
        :id="eid"
    >
        <shadcn-card-header>
            <shadcn-card-title class="flex items-center gap-3">
                <div>
                    <shadcn-avatar class="border border-zinc-400/50">
                        <shadcn-avatar-image
                            :src="`/category/${category}.svg`"
                            :alt="category"
                            class="bg-gray-100/50 dark:bg-surface-400/50"
                        />
                        <shadcn-avatar-fallback>
                            <Icon name="game-icons:tennis-court" />
                        </shadcn-avatar-fallback>
                    </shadcn-avatar>
                </div>
                <div>
                    <nuxt-link
                        class="hover-link"
                        :to="`/tournaments/${tournamentName}/${tid}`"
                        >{{ tname }}
                    </nuxt-link>
                </div>
            </shadcn-card-title>
            <shadcn-card-description>
                <div v-if="ename">{{ ename }}</div>
            </shadcn-card-description>
        </shadcn-card-header>
        <shadcn-card-content>
            <shadcn-separator class="mt-2 mb-4" />
            <div class="flex flex-col gap-1 justify-end text-zinc-500 dark:text-zinc-400 text-sm">
                <div
                    class="text-center md:text-left flex items-center gap-2"
                    v-if="city"
                >
                    <span>{{ city }}</span>
                    <span>
                        <Icon
                            v-if="countryCode"
                            :name="`flag:${countryCode}-4x3`"
                            class="border border-zinc-500 rounded"
                        />
                        <component
                            v-else
                            :is="`Icons${country}`"
                        />
                    </span>
                </div>
                <div class="text-center md:text-left">{{ dates }}</div>
                <div
                    v-if="surface"
                    class="text-center md:text-left"
                >
                    {{ surface }}
                </div>
            </div>
        </shadcn-card-content>
        <shadcn-card-footer class="flex flex-wrap justify-between md:justify-evenly mt-5 gap-2">
            <template
                v-for="page in EVENT_PAGES"
                :key="page.title"
            >
                <shadcn-button
                    v-if="isDisabled"
                    disabled
                    size="xs"
                    class="rounded-full"
                >
                    <div class="text-zinc-400 cursor-not-allowed">
                        <Icon :name="page.icon" />
                        {{ page.title }}
                    </div>
                </shadcn-button>
                <shadcn-button
                    v-else
                    size="xs"
                    class="rounded-full"
                    as-child
                >
                    <div>
                        <Icon :name="page.icon" />
                        <nuxt-link
                            :to="`/tournaments/${tournamentName}/${tid}/${year}/${eid}/${page.route}`"
                            class="hover-link"
                        >
                            {{ page.title }}
                        </nuxt-link>
                    </div>
                </shadcn-button>
            </template>
        </shadcn-card-footer>
    </shadcn-card>
</template>
