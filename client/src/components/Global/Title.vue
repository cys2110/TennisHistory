<script setup>
</script>

<template>
    <div class="text-5xl text-zinc-300 my-10">
        <slot name="title" />
    </div>
    <!--[FIX SPACING]-->
    <div class="text-3xl text-zinc-400 mb-10">
        <slot name="subtitle" />
    </div>
</template>