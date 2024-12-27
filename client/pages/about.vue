<script setup>
definePageMeta({ name: 'About' })
useHead({ title: 'About' })
</script>

<template>
    <div>
        <page-title>
            <template #heading>About</template>
        </page-title>
        <div class="my-16 text-zinc-400">
            <div class="text-xl font-bold">
                DISCLAIMER: This website is not intended to infringe on any copyright. This was made solely to
                hone my coding skills and is not intended for any monetary or other disallowed purposes.
            </div>
            <div>
                This website displays data about Open Era men's singles tennis in a user-friendly format. The
                goal is to include data going back to 1968 as well as Davis Cup data. At some point in the
                future, I may include women's tennis or men's doubles or tournaments lower than the ATP Tour,
                but for now no expansion is planned on the data. Instead new features will be introduced as
                often as possible. Suggestions are welcome!
            </div>
        </div>
    </div>
</template>