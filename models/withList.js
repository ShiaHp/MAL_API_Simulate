const { Schema, model } = require("mongoose");




const WishlistSchema = new Schema({
    userid: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    wish: String
  });



  const Wishlist = model("Wishlists", WishlistSchema);

  module.exports = Wishlist;