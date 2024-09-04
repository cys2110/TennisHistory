<template>
    <div class="flex-col text-center m-2">
        <div class="font-bold lg:text-2xl">
            <slot name="stat" />
        </div>
        <div class="text-xs lg:text-sm">
            <slot name="date" />
        </div>
        <div class="text-xs lg:text-sm">
            <slot name="stat-name" />
        </div>
    </div>
</template>