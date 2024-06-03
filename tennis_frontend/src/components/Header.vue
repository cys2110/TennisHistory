<script setup>
import H2HScrim from './H2HScrim.vue';
import Search from './Search.vue'
</script>

<template>
    <v-app-bar
        scroll-behavior="elevate"
        color="indigo-darken-4"
    >
        <v-app-bar-title
            text="Tennis History"
            class="custom-font text-h6 text-sm-h4"
        />
        <!--Home-->
        <v-btn
            icon="fas fa-house"
            :to="{name: 'home'}"
        />
        <!--Archive-->
        <v-btn
            icon="far fa-calendar"
            :to="{name: 'Results Archive'}"
        />
        <!--Head to head-->
        <v-btn
            icon=""
        >
            <v-icon
                icon="fad fa-people-arrows"
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
        >
            <v-icon
                icon="fas fa-magnifying-glass"
            />
            <v-dialog
                activator="parent"
                transition="dialog-bottom-transition"
                height="70%"
                opacity="50%"
                scroll-strategy="reposition"
            >
                <template v-slot:default="{ isActive }">
                    <Search @close="isActive.value = false" />
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