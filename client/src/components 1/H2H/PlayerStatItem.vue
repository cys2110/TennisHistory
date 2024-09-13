<script setup lang="ts"></script>

<template>
    <div class="flex justify-between my-3">
        <span>
            <slot name="field"></slot>
        </span>
        <span class="font-bold">
            <slot name="value"></slot>
        </span>
    </div>
</template>