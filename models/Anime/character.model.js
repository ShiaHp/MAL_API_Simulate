const { Schema, model } = require("mongoose");

const characterSchema = new Schema(
  {
    name : String,
    role : {
      type : String,
      enum : ['Main' , 'Support'],
    },
    VaId :[{
      type: Schema.Types.ObjectId,
      ref: "voiceActor",
    }],
    Animeography : [{
      type: Schema.Types.ObjectId,
      ref: "Anime",
    }],
    information :{
        type :String,
        required : true,
    },

   
  },
  { collection: "character" , timestamps: true }
);
characterSchema.index({name  : "text"})
characterSchema.index({Animeography :  1})

module.exports = model("character", characterSchema);
