<script setup lang="ts">
import { convert } from "convert";
import { debounce } from "lodash";

const route = useRoute();
const router = useRouter();
const p1Id = computed(() => route.params.p1Id);
const p2Id = computed(() => route.params.p2Id);
const p1Name = computed(() => route.params.p1Name);
const p2Name = computed(() => route.params.p2Name);
const props = defineProps<{
    player: H2HPlayer;
    colour: string;
}>();
const { bh, dob, id, name, height, rh, pro, country } = props.player;
const open = ref(false);
const searchTerm = ref("");
const selectOptions: Ref<{ id: string; name: string }[]> = ref([]);

// Get country code for icons
const countryCode = getCountryCode(country);

const playingHand = computed(() => {
    switch (rh) {
        case true:
            return "Right-handed";
        case false:
            return "Left-handed";
        default:
            return "Unknown";
    }
});

const backhand = computed(() => {
    switch (bh) {
        case true:
            return "One-handed";
        case false:
            return "Two-handed";
        default:
            return "Unknown";
    }
});

const height_ft = computed(() => {
    if (height) {
        const ftDecimal = convert(height.low, "cm").to("ft");
        const ft = Math.floor(ftDecimal);
        const inches = Math.round((ftDecimal - ft) * 12);
        return `${ft}'${inches}"`;
    }
});

const descriptionItems = [
    { title: "DOB", value: dob ?? "Unknown" },
    { title: "Height", value: height ? `${height.low}cm (${height_ft.value})` : "Unknown" },
    { title: "Plays", value: playingHand },
    { title: "Backhand", value: backhand },
    { title: "Turned pro", value: pro ?? "Unknown" }
];

const getSearchResults = async () => {
    const { data, status, error } = await $fetch("/api/getPlayerSearchResults", {
        method: "GET",
        params: { searchTerm: searchTerm.value },
        timeout: 3000,
        onResponse({ request, response, options }) {
            selectOptions.value = Array.isArray(response._data) ? response._data : [];
        }
    });
};

const debouncedSearch = debounce(getSearchResults, 300);

const handleSearch = (e: any) => {
    searchTerm.value = e.target.value;
    debouncedSearch();
};

const handleSelect = (e: any) => {
    const formattedName = encodeName(e.detail.value.name);
    if (p1Id.value === id) {
        router.push({ path: `/h2h/${formattedName}-v-${p2Name.value}/${e.detail.value.id}-${p2Id.value}`, force: true });
    } else {
        router.push({ path: `/h2h/${p1Name.value}-v-${formattedName}/${p1Id.value}-${e.detail.value.id}`, force: true });
    }
};
</script>

<template>
    <ClientOnly>
        <shadcn-card :class="colour">
            <shadcn-card-header>
                <shadcn-card-title>
                    <div>
                        <shadcn-avatar
                            class="border border-zinc-400"
                            size="lg"
                        >
                            <shadcn-avatar-image
                                :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`"
                                :alt="name"
                            />
                            <shadcn-avatar-fallback>
                                <Icon name="material-symbols:person-rounded" />
                            </shadcn-avatar-fallback>
                        </shadcn-avatar>
                    </div>
                </shadcn-card-title>
                <shadcn-card-description>
                    <div class="flex justify-between">
                        <div>{{ name }}</div>
                        <div>
                            <Icon
                                v-if="countryCode"
                                :name="`flag:${countryCode}-4x3`"
                                class="border border-zinc-400 rounded"
                            />
                            <component
                                v-else
                                :is="`Icons${country}`"
                            />
                        </div>
                    </div>
                    <shadcn-separator />
                </shadcn-card-description>
            </shadcn-card-header>
            <shadcn-card-content>
                <div
                    v-for="item in descriptionItems"
                    :key="item.title"
                    class="flex justify-between my-1"
                >
                    <span>{{ item.title }}</span>
                    <span class="font-bold">{{ item.value }}</span>
                </div>
            </shadcn-card-content>
            <shadcn-card-footer>
                <shadcn-popover v-model:open="open">
                    <shadcn-popover-trigger as-child>
                        <shadcn-button
                            variant="outline"
                            role="combobox"
                            class="w-full"
                        >
                            Search players
                            <Icon name="ph:magnifying-glass-duotone" />
                        </shadcn-button>
                    </shadcn-popover-trigger>
                    <shadcn-popover-content class="w-3/4 mx-auto">
                        <shadcn-command>
                            <shadcn-command-input
                                placeholder="Search players"
                                @input="handleSearch"
                            />
                            <shadcn-command-list>
                                <shadcn-command-empty>
                                    <Icon name="material-symbols:person-off-outline-rounded" />
                                    No players found
                                </shadcn-command-empty>
                                <shadcn-command-group>
                                    <shadcn-command-item
                                        v-for="player in selectOptions"
                                        :key="player.id"
                                        :value="player"
                                        @select="handleSelect"
                                    >
                                        {{ player.name }}
                                    </shadcn-command-item>
                                </shadcn-command-group>
                            </shadcn-command-list>
                        </shadcn-command>
                    </shadcn-popover-content>
                </shadcn-popover>
            </shadcn-card-footer>
        </shadcn-card>
    </ClientOnly>
</template>
