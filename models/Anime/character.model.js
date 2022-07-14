const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
  {
    VAId  :[{
        type : Schema.type.ObjectId,
        ref : "VoiceActor",
    }],
    Animeography : [{
        type : Schema.type.ObjectId,
        ref  : "Anime",
    }],
    information :{
        type :String,
        required : true,
    },

   
  },
  { collection: "character" , timestamps: true }
);


module.exports = model("character", characterSchema);
