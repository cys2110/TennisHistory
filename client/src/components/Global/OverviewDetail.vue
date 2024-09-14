<template>
    <div class="my-2 bg-indigo-800 text-zinc-300 py-1 px-3 rounded-lg flex justify-between">
        <div>
            <slot name="detailName" />
        </div>
        <div class="text-right">
            <slot name="detail" />
        </div>
    </div>
</template>