const { Schema, model } = require("mongoose");

const voiceActorSchema = new Schema(
  {
    characterId  :[{
        type : Schema.type.ObjectId,
        ref : "character",
    }],
    roleInAnime : [{
        type : Schema.type.ObjectId,
        ref  : "Anime",
    }],
    information :{
        type :String,
        required : true,
    },

   
  },
  { collection: "voiceActor" , timestamps: true }
);


module.exports = model("voiceActor", voiceActorSchema);
