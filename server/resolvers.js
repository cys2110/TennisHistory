import convert from "convert-units";

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
    plays(source) {
      switch (source.rh) {
        case true:
          return "Right-handed";
        case false:
          return "Left-handed";
        default:
          return null;
      }
    },
    backhand(source) {
      switch (source.bh1) {
        case true:
          return "One-handed";
        case false:
          return "Two-handed";
        default:
          return null;
      }
    },
    height_ft(source) {
      if (source.height_cm) {
        const ftDecimal = convert(parseInt(source.height_cm))
          .from("cm")
          .to("ft");
        const ft = Math.floor(ftDecimal);
        const inches = Math.round((ftDecimal - ft) * 12);
        return `${ft}'${inches}"`;
      }
      return null;
    },
  },
  Coach: {
    full_name(source) {
      const { first_name, last_name } = source;
      if (first_name && last_name) {
        return `${first_name} ${last_name}`;
      } else {
        return null;
      }
    },
  },
};
