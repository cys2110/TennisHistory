export default defineStore('tournament-name', () => {
    const tournamentName = ref('')
    const capitalisedName = computed(() => useChangeCase(tournamentName.value, 'capitalCase').value)
    const paramName = computed(() => useChangeCase(tournamentName.value, 'kebabCase').value)

    return { tournamentName, capitalisedName, paramName }
})