// https://myanimelist.net/anime/{id}/episodes

const { Schema, model } = require("mongoose");

const animeSchema = new Schema(
  {
    titleEng: {
      type: String,
      required: true,
    },
    alternativeTitle: {
      type: String,
    },
    Synopsis: {
      type: String,
    },
    Background: {
      type: String,
    },
    ratingCount: {
      type: Number,
    },
    ratingValue: {
      type: Number,
    },
    ratingAvg: {
      type: Number,
    },

    Type: {
      type: String,
      enum: ["TV", "ONAs", "Movies", "Specials"],
    },
    Episodes: Number,
    Status: {
      Type: String,
      enum: ["Completed", "Airing", "Canceled", "Continued"],
    },
    Aired: {
      type: String,
    },
    Premiered: {
      type: Schema.Types.ObjectId,
      ref: "season",
    },
    Broadcast: {
      type: Date,
    },
    Source: {
      type: String,
      enum: [
        "Original",
        "Manga",
        "Light Novel",
        "Movie",
        "Series",
        "Visual Novel",
      ],
    },
    Genres: [
      {
        type: String,
        enum: [
          "Action",
          "Adventure",
          "Cars",
          "Comedy",
          "AvantGarde",
          " Demons",
          "Mystery",
          "Drama",
          "Ecchi",
          "Fantasy",
          "Game",
          "Hentai",
          "Historical",
          "Horror",
          "Kids",
          "MartialArts",
          "Mecha",
          "Music",
          "Parody",
          "Samurai",
          "Romance",
          "School",
          "SciFi",
          "Shoujo",
          "Girls love",
          "Shounen",
          "Boys love",
          "Space",
          "Sports",
          "SuperPower",
          "Vampire",
          "Harem",
          "Slice of Life",
          "Supernatural",
          "Military",
          "Police",
          "Psychological",
          "Suspense",
          "Seinen",
          "Josei",
          "Award winning",
          "Gourmet",
          "Work life",
          "Erotica",
        ],
      },
    ],
    Duration: {
      type: String,
    },
    Rating: {
      type: Number,
    },
    openingTheme: {
      type: String,
    },
    endingTheme: {
      type: String,
    },
    episodeId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Episode",
      },
    ],
    StreamingPlatforms: [String],
  },

  { collection: "Anime", timestamps: true }
);

animeSchema.index({ titleEng: "text" });

module.exports = model("Anime", animeSchema);
