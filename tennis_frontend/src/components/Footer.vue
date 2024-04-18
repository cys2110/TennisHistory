<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
</script>

<template>
    <div class="footer-wrapper">
        <div class="footer-column">
            <div class="heading">Credits</div>
            <div>Claire Sheridan</div>
            <div><a href="https://github.com/cys2110" target="_blank"><FontAwesomeIcon :icon="faGithub" class="icon" /></a> | <a href="www.linkedin.com/in/claire-y-sheridan" target="_blank"><FontAwesomeIcon :icon="faLinkedin" class="icon" /></a></div>
            <div></div>
        </div>
        <div class="footer-column">
            <div class="heading">About</div>
            <div>Rules</div>
            <div>Terms and Conditions</div>
        </div>
        <div class="footer-column">
            <div class="heading">Related Links</div>
            <a href="https://www.atptour.com/en" target="_blank" class="link hover-link">ATP</a>
            <a href="https://www.itftennis.com/en/" target="_blank" class="link hover-link">ITF</a>
        </div>
    </div>
</template>

<style scoped>
.footer-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    background: var(--header-background);
    padding: 1rem;
    margin-top: 2rem;
}

.footer-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}

.footer-column > div {
    line-height: 2rem;
}

.icon {
    cursor: pointer;
    color: var(--color-text);
    font-size: large;
}

.link {
    color: var(--color-text);
}

.heading {
    text-transform: uppercase;
    font-weight: bold;
    font-size: large;
}
</style>