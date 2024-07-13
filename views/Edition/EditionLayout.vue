<template>
    <v-sheet >
        <v-container v-if="edition">
            <v-row >
                <v-col>
                    <v-toolbar >
                        <v-tabs

                        >
                            <v-tab
                                :to="{name: 'Results'}"
                            >
                                Results
                            </v-tab>
                        </v-tabs>
                    </v-toolbar>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>