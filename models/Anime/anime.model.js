// https://myanimelist.net/anime/{id}/episodes


const { Schema, model } = require("mongoose");

const animeSchema = new Schema(
  {
    titleEng : {
        type: String,
        required: true,
    },
    episodeId :[{
      type : Schema.Types.ObjectId,
      ref : 'Episode'
    }]
  },
  { collection: "Anime" }
);

animeSchema.index({titleEng : "text"})



module.exports = model("Anime", animeSchema);
