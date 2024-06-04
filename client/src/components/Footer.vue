<template>
    <v-footer
        class="flex-col !bg-indigo-800 max-h-24"
    >
        <div class="px-4">
            <!--need to add about link-->
            <v-btn
                class="!text-indigo-50"
                rounded="xl"
                variant="text"
            >
                About
            </v-btn>
            <v-btn
                class="!text-indigo-50"
                rounded="xl"
                variant="text"
                href="https://www.atptour.com/en"
            >
                ATP
            </v-btn>
            <v-btn
                class="!text-indigo-50"
                rounded="xl"
                variant="text"
                href="https://www.itftennis.com/en/"
            >
                ITF
            </v-btn>
        </div>
        <div class="px-4 py-2 text-center">
            Created by <a class="!text-green-600" href="https://www.claire-sheridan.com" target="_blank">Claire Sheridan</a> using Vuetify and TailwindCSS
        </div>
    </v-footer>
</template>