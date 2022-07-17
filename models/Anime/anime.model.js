// https://myanimelist.net/anime/{id}/episodes
const slugify = require("slugify");
const { Schema, model } = require("mongoose");

const animeSchema = new Schema(
  {
    titleEng: {
      type: String,
      required: true,
    },
    
    slug: String,

    alternativeTitle: {
      type: String,
    },
    image: {
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
      enum: ["TV", "ONAs", "Movies", "Specials","Musics"],
    },
    Episodes: Number,
    Status: {
      type: String,
      enum: ["Completed", "Airing", "Canceled", "Continued"],
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
    openingTheme: {
      type: String,
    },
    endingTheme: {
      type: String,
    },
    Premiered: {
      type: Schema.Types.ObjectId,
      ref: "season",
    },
    Rated: {
      type: String,
      enum: [
        "G-All-ages",
        "PG-children",
        "PG-13 - Teens 13 or older",
        "R - 17+ (violence & profanity)",
        "R+ - Mild Nudity",
        "Rx - Hentai",
      ],
   
    },
    startDate : Date,
    endDate : Date,
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
animeSchema.pre("save", function (next) {
  this.slug = slugify(this.titleEng, { lower: true });
  next();
});
module.exports = model("Anime", animeSchema);
