<script setup>
import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import Icon from '@ant-design/icons-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { convertToFt, encodeName, flag, smallDate } from '@/utils/functions';
import { COLOURS } from '@/utils/variables';
import { SEARCH_PLAYER } from '@/services/MiscService';

const router = useRouter();
const route = useRoute()
const props = defineProps(['player', 'number'])
const cardTheme = { colorBgContainer: props.number === 1 ? COLOURS.violet700 : COLOURS.green800 }
const searchTerm = ref('Search player');
const options = ref([]);
const selectedFlag = shallowRef(null)

const { query, variables } = SEARCH_PLAYER(searchTerm.value);
const { result, loading, error, refetch } = useQuery(query, variables);

watch(result, newResult => {
    if (newResult) options.value = newResult.searchPlayers
})

watch(error, newError => console.error(newError))

const playingHand = computed(() => {
    switch (props.player.rh) {
        case true:
            return "Right-handed"
        case false:
            return "Left-handed"
        default:
            return 'Unknown'
    }
})

const backhand = computed(() => {
    switch (props.player.bh1) {
        case true:
            return 'One-handed'
        case false:
            return 'Two-handed'
        default:
            return 'Unknown'
    }
})

const descriptionItems = [
    { title: 'DOB', value: props.player.dob ? smallDate(props.player.dob) : 'Unknown' },
    { title: 'Height', value: props.player.height_cm ? `${props.player.height_cm} cm (${convertToFt(props.player.height_cm)})` : 'Unknown' },
    { title: 'Plays', value: playingHand },
    { title: 'Backhand', value: backhand },
    { title: 'Turned pro', value: props.player.turned_pro?.id ?? 'Unknown' },
]

const handleSearch = (e) => refetch({ fullName: e })

const handleSelect = (name, id) => {
    if (props.number === 1) {
        router.push({ name: 'h2h', params: { p1Name: encodeName(name), p1Id: id, p2Name: route.params.p2Name, p2Id: route.params.p2Id } })
    } else {
        router.push({ name: 'h2h', params: { p1Name: route.params.p1Name, p1Id: route.params.p1Id, p2Name: encodeName(name), p2Id: id } })
    }
}

onMounted(async () => {
    const countryCode = props.player.country.id;
    try {
        selectedFlag.value = (
            await import(`@/components/icons/flags`)
        )[countryCode] || null;
    } catch (error) {
        console.error(`Flag for ${countryCode} not found`, error);
    }
});
</script>

<template>
    <a-config-provider :theme="{ components: { Card: cardTheme } }">
        <a-card>
            <template #title>
                <router-link class="hover-link"
                    :to="{ name: 'player', params: { name: encodeName(player.full_name), id: player.id } }">
                    {{ player.full_name }}</router-link>
            </template>
            <template #extra>
                <div class="flex justify-end items-center w-full">
                    <Icon class="text-2xl" :component="selectedFlag" />
                </div>
            </template>
            <a-card-meta>
                <template #description>
                    <div v-for="item in descriptionItems" :key="item.title" class="flex justify-between my-1">
                        <span>{{ item.title }}</span>
                        <span class="font-bold">{{ item.value }}</span>
                    </div>
                </template>
            </a-card-meta>
            <template #actions>
                <a-config-provider :theme="{
                    components: {
                        Select: {
                            colorBgContainer: 'transparent', activeBorderColor: COLOURS.zinc300,
                            hoverBorderColor: COLOURS.zinc300,
                            colorBorder: COLOURS.zinc400,
                            color: COLOURS.zinc400
                        }
                    }
                }">
                    <a-select :value="searchTerm" show-search class="w-4/5" placeholder="Search player"
                        @search="handleSearch">
                        <template #suffixIcon><search-outlined /></template>
                        <a-select-option v-for="option in options" :key="option.id" :value="option.full_name"
                            @click="handleSelect(option.full_name, option.id)">
                            {{ option.full_name }}</a-select-option>
                    </a-select>
                </a-config-provider>
            </template>
        </a-card>
    </a-config-provider>
</template>