<script setup lang="ts">
import { NavigationMenu } from 'reka-ui/namespaced';

const navLinks = [
    {
        label: 'Tournaments',
        children: [
            {
                label: 'Upcoming Tournaments',
                to: { name: 'upcoming' }
            },
            {
                label: 'Results Archive',
                to: { name: 'archive' }
            },
            {
                label: 'All Tournaments',
                to: { name: 'tournaments' }
            }
        ]
    },
    {
        label: 'Players',
        to: { name: 'players' }
    },
    {
        label: 'Head to Head',
        to: { name: 'h2h' }
    },
    {
        label: 'Search',
        to: { name: 'search' }
    }
]
</script>

<template>
    <header class="bg-violet-600 p-4 flex justify-between items-center">
        <div class="font-cursive text-2xl">
            TennisHistory
        </div>
        <NavigationMenu.Root>
            <NavigationMenu.List>
                <NavigationMenu.Item v-for="link in navLinks" :key="link.label">
                    <NavigationMenu.Trigger v-if="link.children">{{ link.label }}</NavigationMenu.Trigger>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    </header>
</template>