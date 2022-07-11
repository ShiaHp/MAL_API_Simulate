
const express = require('express')
const router = express.Router();
const { registerUser ,  verifyUser,loginUser,forgotPassword ,resetPassword  } = require('../controllers/user.controller')

router.post("/register", registerUser );
router.post("/login",loginUser )
router.post('/verifyUser', verifyUser)
router.get("/forgotPassword",forgotPassword )
router.patch("/resetPassword",resetPassword)


module.exports = router;

