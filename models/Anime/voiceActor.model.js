const { Schema, model } = require("mongoose");

const voiceActorSchema = new Schema(
  {
    name : String,
    information :{
        type :String,
        required : true,
    },
    roleInAnime: [{
      type: Schema.Types.ObjectId,
      ref: "Anime",
    }],
    characterRole: [{ 
      type: Schema.Types.ObjectId,
      ref: "character",
  }],

   
  },
  { collection: "voiceActor" , timestamps: true }
);
voiceActorSchema.index({name : "text"})

module.exports = model("voiceActor", voiceActorSchema);



  



