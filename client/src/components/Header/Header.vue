<script setup lang="ts">
import { useDisplay } from 'vuetify';
import SearchScrim from './SearchScrim.vue';
import H2HScrim from './H2HScrim.vue';

const { smAndDown } = useDisplay()

const items = [
    {
        route: 'Home',
        icon: 'fas fa-house',
        tooltip: 'Home'
    },
    {
        route: 'Archive',
        icon: 'far fa-calendar',
        tooltip: 'Archive'
    },
    {
        icon: 'fas fa-magnifying-glass',
        tooltip: 'Search',
        dialogComponent: SearchScrim
    },
    {
        icon: 'fad fa-people-arrows',
        tooltip: 'Head to Head',
        dialogComponent: H2HScrim
    }
]
</script>

<template>
    <v-app-bar
        class="!bg-indigo-800 px-3"
        scroll-behavior="elevate"
    >
        <v-app-bar-title
            class="custom-font !text-xl sm:!text-2xl md:!text-3xl"
            text="Tennis History"
        />
        <div
            v-for="item in items"
            :key="item.tooltip"
        >
            <v-btn
                class="mx-1"
                :to="item.route ? {name: item.route} : ''"
                :density="smAndDown ? 'comfortable' : 'default'"
                icon=""
            >
                <v-icon :icon="item.icon"/>
                <v-tooltip
                    content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                    :text="item.tooltip"
                    activator="parent"
                    location="bottom"
                    height="30"
                />
                <v-dialog
                    v-if="item.dialogComponent"
                    activator="parent"
                    transition="dialog-bottom-transition"
                    height="70%"
                    opacity="50%"
                    scroll-strategy="reposition"
                >
                    <template
                        v-slot:default="{ isActive }"
                    >
                        <component
                            :is="item.dialogComponent"
                            @close="isActive.value = false"
                        />
                    </template>
                </v-dialog>
            </v-btn>
        </div>
    </v-app-bar>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap');

.custom-font {
    font-family: 'Fugaz One';
}
</style>