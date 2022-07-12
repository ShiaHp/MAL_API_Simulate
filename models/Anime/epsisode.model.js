const { Schema, model } = require("mongoose");

const episodeSchema = new Schema(
  {
    titleEng : {
        type: String,
        required: true,
    },
    titleJP : {
        type :String,
    },
    VideoUrl  :{
        type : String,
    },
    aired :{
        type :Date,
    },
    animeId : {
        type : Schema.Types.ObjectId,
        ref : "Anime"
    }
 
  },
  { collection: "episode" }
);



episodeSchema.index({titleEng : 'text'}, {titleJP : "text"})

episodeSchema.virtual('Anime',{
    ref : 'Anime',
    localField : "_id",
    foreignField : "episode",
    as : "episode_Anime",
})




module.exports = model("Episode", episodeSchema);
