export const resolvers = {
    Player: {
        full_name(source) {
            return `${source.first_name} ${source.last_name}`
        }
    },
    Coach: {
        full_name(source) {
            return `${source.first_name} ${source.last_name}`
        }
    }
}