<template>
    <v-footer
        class="flex-col !bg-indigo-800 max-h-24"
    >
        <div class="px-4">
            <!-- <v-btn
                class="!text-indigo-50"
                rounded="xl"
                variant="text"
                :to="{name: 'About'}"
            >
                About
            </v-btn> -->
            <v-btn
                class="!text-zinc-300"
                rounded="xl"
                variant="text"
                href="https://www.atptour.com/en"
            >
                ATP
            </v-btn>
            <v-btn
                class="!text-zinc-300"
                rounded="xl"
                variant="text"
                href="https://www.itftennis.com/en/"
            >
                ITF
            </v-btn>
        </div>
        <div class="px-4 pt-2 pb-4 text-center text-zinc-300">
            Created by <a class="hover-link" href="https://www.claire-sheridan.com" target="_blank">Claire Sheridan</a> using Vuetify and TailwindCSS
        </div>
    </v-footer>
</template>