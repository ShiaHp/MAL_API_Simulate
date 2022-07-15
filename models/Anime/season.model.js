const { Schema, model } = require("mongoose");

const seasonSchema = new Schema(
  {
    year: {
      type: Number,
    },
    season: {
      type: String,
      enum: ["Spring", "Summer", "Autumn", "Winter"],
    },
    animeIdOfSeason: [
      {
        type: Schema.Types.ObjectId,
        ref: "Anime",
      },
    ],
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
      if (year < 1920 || year > 3000 ) {
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
