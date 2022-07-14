const { Schema, model } = require("mongoose");

const CharVASchema = new Schema(
  {
    VAId  :[{
        type : Schema.type.ObjectId,
        ref : "VoiceActor",
    }],
    Animeography : {
        type : Schema.type.ObjectId,
        ref  : "Anime",
    },
    characterId  :[{
        type : Schema.type.ObjectId,
        ref : "character",
    }],

   
  },
  { collection: "Char&&VA" , timestamps: true }
);


module.exports = model("Char&&VA", CharVASchema);
