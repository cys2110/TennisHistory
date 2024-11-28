export const resolvers = {
  Active: {
    full_name(source) {
      return `${source.first_name} ${source.last_name}`;
    },
  },
  Player: {
    full_name(source) {
      return `${source.first_name} ${source.last_name}`;
    },
  },
  Coach: {
    full_name(source) {
      return `${source.first_name} ${source.last_name}`;
    },
  },
};
