export default defineStore('player-name', () => {
    const playerName = ref('')
    const capitalisedName = computed(() => useChangeCase(playerName.value, 'capitalCase').value)
    const paramName = computed(() => useChangeCase(playerName.value, 'kebabCase').value)

    return { playerName, capitalisedName, paramName }
})