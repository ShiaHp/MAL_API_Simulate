
const express = require('express')
const router = express.Router();
const { registerUser , createWishlist,findWishlist, verifyUser } = require('../controllers/user.controller')

router.route("/wishlist").get(findWishlist).post(createWishlist)



module.exports = router;