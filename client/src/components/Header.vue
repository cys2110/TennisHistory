<script setup lang="ts"></script>

<template>
    <v-app-bar
        scroll-behavior="elevate"
        class="!bg-indigo-800 px-3"
    >
        <v-app-bar-title
            text="Tennis History"
            class="custom-font !text-3xl"
        />
        <!--Home-->
        <v-btn
            :to="{name: 'Home'}"
            density="comfortable"
            icon=""
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
    </v-app-bar>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap');

.custom-font {
    font-family: 'Fugaz One';
}
</style>