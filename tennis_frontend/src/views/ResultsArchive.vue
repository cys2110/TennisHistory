<script setup>
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import { computed, onMounted, ref, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-duotone-svg-icons'
import EditionService from '@/services/EditionService';
import ArchiveCard from '@/components/ArchiveCard.vue';

const years = Array.from({length: 2025-1968}, (_, index) => 2024 - index)
const searchYear = ref(2024)
const dropdownVisible = ref(false)
const results = ref([])

const filteredYears = computed(() => {
    return years.filter(year => String(year).includes(searchYear.value))
})

const toggleDropdown = () => {
    dropdownVisible.value = !dropdownVisible.value
    searchYear.value = ''
}

onMounted(() => {
    const closeDropdown = (event) => {
        if (!event.target.closest('.dropdown-search')) {
            dropdownVisible.value = false
        }
    }
    document.addEventListener('click', closeDropdown)
    return () => document.removeEventListener('click', closeDropdown)
})

watch(searchYear, () => {
    if (searchYear.value !== '') {
        EditionService.getEditionsByYear(searchYear.value)
        .then(response => {
            results.value = response.data
            console.log(results.value)
        })
        .catch(error => console.log(error))
    }
}, {immediate: true})

</script>

<template>
    <main>
        <div class="view-heading">
            <h1>Results Archive</h1>
            <div class="dropdown">
                <div class="dropdown-search">
                    <button>
                        <span><BaseInput type="text" placeholder="Year" v-model="searchYear" @input="dropdownVisible = true" /></span>
                        <span v-if="dropdownVisible"><FontAwesomeIcon :icon="faChevronUp" @click.stop="toggleDropdown" /></span>
                        <span v-else><FontAwesomeIcon :icon="faChevronDown" @click.stop="toggleDropdown" /></span>
                    </button>
                </div>
                <div class="dropdown-menu" v-show="dropdownVisible">
                    <li class="dropdown-menu-item" v-for="year in filteredYears" @click="searchYear = year" :key="year">{{ year }}</li>
                </div>
            </div>
        </div>
        <div class="results-wrapper" v-if="results.length > 0">
            <ArchiveCard v-for="result in results" :key="result.id" :edition="result" />
        </div>
        <div class="results-wrapper" v-else>No data available yet</div>
    </main>
</template>