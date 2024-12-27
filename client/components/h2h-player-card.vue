<script setup>
import { useChangeCase } from '@vueuse/integrations'
import { convert } from 'convert'
import { debounce } from 'lodash'

const route = useRoute()
const router = useRouter()
const p1Id = ref(route.params.p1Id)
const p2Id = ref(route.params.p2Id)
const p1Name = ref(route.params.p1Name)
const p2Name = ref(route.params.p2Name)
const props = defineProps(['player', 'colour'])
const { bh, dob, id, name, height, rh, pro, country } = props.player
const searchTerm = ref('')
const selectOptions = ref([])

// Get country code for icons
const countryCode = getCountryCode(country)

const playingHand = computed(() => {
    switch (rh) {
        case true:
            return 'Right-handed'
        case false:
            return 'Left-handed'
        default:
            return 'Unknown'
    }
})

const backhand = computed(() => {
    switch (bh) {
        case true:
            return 'One-handed'
        case false:
            return 'Two-handed'
        default:
            return 'Unknown'
    }
})

const height_ft = computed(() => {
    const ftDecimal = convert(height, 'cm').to('ft')
    const ft = Math.floor(ftDecimal)
    const inches = Math.round((ftDecimal - ft) * 12)
    return `${ft}'${inches}"`
})

const descriptionItems = [
    { title: 'DOB', value: dob ?? 'Unknown' },
    { title: 'Height', value: height ? `${height}cm (${height_ft.value})` : 'Unknown' },
    { title: 'Plays', value: playingHand },
    { title: 'Backhand', value: backhand },
    { title: 'Turned pro', value: pro ?? 'Unknown' }
]

const getSearchResults = async () => {
    const { data, status, error } = await $fetch('/api/getPlayerSearchResults', {
        method: 'GET',
        params: { searchTerm: searchTerm.value },
        timeout: 3000,
        onResponse({ request, response, options }) {
            selectOptions.value = Array.isArray(response._data) ? response._data : []
        }
    })
}

const debouncedSearch = debounce(getSearchResults, 300)

const handleSearch = () => {
    if (typeof searchTerm.value === 'string') {
        debouncedSearch()
    } else {
        handleSelect(searchTerm.value)
    }
}

const handleSelect = (e) => {
    const formattedName = useChangeCase(e.name, 'snakeCase')
    if (p1Id.value === id) {
        router.push({ path: `/h2h/${formattedName.value}-v-${p2Name.value}/${e.id}-${p2Id.value}`, force: true })
    } else {
        router.push({ path: `/h2h/${p1Name.value}-v-${formattedName.value}/${p1Id.value}-${e.id}`, force: true })
    }
}
</script>

<template>
    <card :class="colour">
        <template #header>
            <u-avatar :src="`https://www.atptour.com/-/media/alias/player-headshot/${id}`" :alt="name" size="3xl" />
        </template>
        <template #title>
            <div class="flex justify-between items-center">
                <div class="font-bold">{{ name }}</div>
                <div>
                    <Icon v-if="countryCode" :name="`flag:${countryCode.toLowerCase()}-4x3`" />
                    <component v-else :is="`Icons${country}`" />
                </div>
            </div>
            <Divider />
        </template>
        <template #content>
            <div v-for="item in descriptionItems" :key="item.title" class="flex justify-between my-1">
                <span>{{ item.title }}</span>
                <span class="font-bold">{{ item.value }}</span>
            </div>
        </template>
        <template #footer>
            <Divider />
            <FloatLabel variant="on">
                <Select id="search" type="text" v-model="searchTerm" size="small" :options="selectOptions"
                    option-label="name" @update:model-value="handleSearch" class="w-full" editable>
                    <template #option="{ option }">
                        <div class="flex items-center" @click="handleSelect(option)">
                            <div>{{ option.name }}</div>
                        </div>
                    </template>
                </Select>
                <label for="search">Search players</label>
            </FloatLabel>
        </template>
    </card>
</template>