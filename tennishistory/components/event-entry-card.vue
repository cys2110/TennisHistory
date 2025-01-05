<script setup lang="ts">
import { StatusType } from "~/types/enums";
const props = defineProps<{ entry: EventEntryType }>();

const statusColours: Record<StatusType, string> = {
    [StatusType.LL]: "bg-red-300 !text-red-800",
    [StatusType.Alt]: "bg-amber-300 !text-amber-800",
    [StatusType.Q]: "bg-emerald-300 !text-green-800",
    [StatusType.WC]: "bg-blue-300 !text-blue-800",
    [StatusType.SE]: "bg-fuchsia-300 !text-fuchsia-800",
    [StatusType.PR]: "bg-teal-300 !text-teal-800"
};
</script>

<template>
    <shadcn-card class="full-card">
        <shadcn-card-header>
            <shadcn-card-title class="flex justify-center">
                <shadcn-avatar
                    class="border border-zinc-400"
                    size="lg"
                >
                    <shadcn-avatar-image
                        :src="`https://www.atptour.com/-/media/alias/player-headshot/${entry.id}`"
                        :alt="entry.name"
                    />
                    <shadcn-avatar-fallback>
                        <Icon name="material-symbols:person-rounded" />
                    </shadcn-avatar-fallback>
                </shadcn-avatar>
            </shadcn-card-title>
            <shadcn-card-description class="text-center font-bold">
                <nuxt-link
                    class="hover-link"
                    :to="`/players/${encodeName(entry.name)}/${entry.id}`"
                >
                    {{ entry.name }}
                </nuxt-link>
            </shadcn-card-description>
        </shadcn-card-header>
        <shadcn-card-content>
            <div class="flex gap-2 justify-center items-center">
                <Icon
                    v-if="getCountryCode(entry.country_id)"
                    :name="`flag:${getCountryCode(entry.country_id)}-4x3`"
                    class="text-base rounded border border-zinc-400"
                />
                <component
                    v-else
                    :is="`Icons${entry.country_id}`"
                />
                <span class="text-zinc-400">{{ entry.country_name }}</span>
            </div>
        </shadcn-card-content>
        <shadcn-card-footer class="flex justify-center items-center gap-2">
            <shadcn-badge
                v-if="entry.seed"
                variant="outline"
                class="bg-green-800 !text-green-300"
            >
                <span class="font-normal">Seed:</span>&nbsp;{{ entry.seed }}
            </shadcn-badge>
            <shadcn-badge
                v-if="entry.status"
                variant="outline"
                :class="statusColours[entry.status as keyof typeof statusColours]"
            >
                <span class="font-normal">Status:</span>&nbsp;{{ STATUS_INFO[entry.status as keyof typeof STATUS_INFO] }}
            </shadcn-badge>
        </shadcn-card-footer>
    </shadcn-card>
</template>
