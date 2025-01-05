<script setup>
useHead({ titleTemplate: (pageTitle) => (pageTitle ? `${pageTitle} | TennisHistory` : "TennisHistory") });
</script>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>

<style>
::-webkit-scrollbar {
    display: none;
}
</style>
