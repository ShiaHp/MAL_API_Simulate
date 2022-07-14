const { Schema, model } = require("mongoose");

const seasonSchema = new Schema(
  {
    year: {
      type: Number,
      unique: true,
    },
    season: {
      type: String,
      enum: ["Spring", "Summer", "Autumn", "Winter"],
    },
    animeIdOfSeason: [String],
  },
  { collection: "season" }
);

seasonSchema.statics.isYearValid = async function (yearCandidate) {
  function yearValidation(year) {
    const text = /^[0-9]+$/;
    if (year != 0) {
      if (year != "" && !text.test(year)) {
        return false;
      }

      if (year.length >= 4) {
        return false;
      }
      const current_year = new Date().getFullYear();
      if (year < 1920 || year > current_year) {
        return false;
      }
      return true;
    }
  }
  const current_year = yearValidation(yearCandidate);
  console.log(current_year);
  return !current_year;
};

module.exports = model("season", seasonSchema);
