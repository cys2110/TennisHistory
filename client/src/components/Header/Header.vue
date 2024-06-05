<script setup lang="ts">
import H2HScrim from './H2HScrim.vue';
import SearchScrim from './SearchScrim.vue';
import { useDisplay } from 'vuetify';

const { smAndDown } = useDisplay()
</script>

<template>
    <v-app-bar
        scroll-behavior="elevate"
        class="!bg-indigo-800 px-3"
    >
        <v-app-bar-title
            text="Tennis History"
            class="custom-font !text-xl sm:!text-2xl md:!text-3xl"
        />
        <!--Home-->
        <v-btn
            :to="{name: 'Home'}"
            :density="smAndDown ? 'comfortable' : 'default'"
            icon=""
            class="mx-1"
        >
            <v-icon icon="fas fa-house" />
            <v-tooltip
                text="Home"
                activator="parent"
                location="bottom"
                content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                height="30"
            />
        </v-btn>
        <!--Archive-->
        <v-btn
            :to="{name: 'Archive'}"
            :density="smAndDown ? 'comfortable' : 'default'"
            icon=""
            class="mx-1"
        >
            <v-icon icon="far fa-calendar" />
            <v-tooltip
                text="Results Archive"
                activator="parent"
                location="bottom"
                content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                height="30"
            />
        </v-btn>
        <!--Head to head-->
        <v-btn
            icon=""
            :density="smAndDown ? 'comfortable' : 'default'"
        >
            <v-icon icon="fad fa-people-arrows" />
            <v-tooltip
                text="Head to Head"
                activator="parent"
                location="bottom"
                content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                height="30"
            />
            <v-dialog
                activator="parent"
                transition="dialog-bottom-transition"
                height="70%"
                opacity="50%"
                scroll-strategy="reposition"
            >
                <template v-slot:default="{ isActive }">
                    <H2HScrim @close="isActive.value = false" />
                </template>
            </v-dialog>
        </v-btn>
        <!--Search-->
        <v-btn
            icon=""
            :density="smAndDown ? 'comfortable' : 'default'"
        >
            <v-icon icon="fas fa-magnifying-glass" />
            <v-tooltip
                text="Search"
                activator="parent"
                location="bottom"
                content-class="!bg-indigo-600 !text-zinc-300 !text-sm"
                height="30"
            />
            <v-dialog
                activator="parent"
                transition="dialog-bottom-transition"
                height="70%"
                opacity="50%"
                scroll-strategy="reposition"
            >
                <template v-slot:default="{isActive}">
                    <SearchScrim @close="isActive.value = false" />
                </template>
            </v-dialog>
        </v-btn>
    </v-app-bar>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap');

.custom-font {
    font-family: 'Fugaz One';
}
</style>