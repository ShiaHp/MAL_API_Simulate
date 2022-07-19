const { Schema, model } = require("mongoose");


const WishlistSchema = new Schema({
    userid: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status : {
      type : String,
      enum : ["Completed", "On Hold", "Dropped", "Plan to Watch" , "Watching"] 
    },
    score  :{
      type : Number,
    },
    wishAnime: {
      type: Schema.Types.ObjectId,
      ref: "Anime",
    } ,
    modified_on : Date
  });

WishlistSchema.pre("save", async function (next) { 
  console.log("Saving...");
  this.modified_on = Date.now();
    next();
})

  const Wishlist = model("Wishlists", WishlistSchema);

  module.exports = Wishlist;