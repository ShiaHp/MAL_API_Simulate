const { Schema, model } = require("mongoose");

const ratingSchema = new Schema(
  {
    userId  :{
        type : Schema.type.ObjectId,
        ref : "Users",
    },
    animeId : {
        type : Schema.type.ObjectId,
        ref  : "Anime",
    },
    value :{
          type : Number,
    },
    Planning : {
        type : String,
        enum : ['Watching','Completed','On-Hold','Dropped','Plan to Watch'] 
    }
   
  },
  { collection: "rating" , timestamps: true }
);
ratingSchema.index({userID : 1}, {animeId  : 1})


module.exports = model("rating", ratingSchema);
