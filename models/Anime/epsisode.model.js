const { Schema, model } = require("mongoose");

const episodeSchema = new Schema(
  {
    titleEng: {
      type: String,
      required: true,
    },
    titleJP: {
      type: String,
    },
    episode: {
      type: Number,
      required: true,
    },
    VideoUrl: {
      type: String,
    },
    aired: {
      type: Date,
    },
    animeId: {
      type: Schema.Types.ObjectId,
      ref: "Anime",
    },
  },
  { collection: "episode" }
);

episodeSchema.index({ titleEng: "text" } , {default_language : "en"})
// not support yet for this
episodeSchema.index({ titleJP: "text" } , {default_language : 'none'} );

episodeSchema.virtual("Anime", {
  ref: "Anime",
  localField: "_id",
  foreignField: "episode",
  as: "episode_Anime",
});

module.exports = model("Episode", episodeSchema);
