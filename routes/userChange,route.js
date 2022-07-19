
const express = require('express')
const router = express.Router();
const {  createWishlist,findAllWishlist } = require('../controllers/user.controller')

router.route("/wishlist/:id").get(findAllWishlist).post(createWishlist)



module.exports = router;