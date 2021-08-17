const express = require("express");
const router = express.Router();
const avatarCtrl = require("../controllers/avatar_Ctrl");

router.get("/random", avatarCtrl.random);
router.get("/batch/:nbr", avatarCtrl.batch);

module.exports = router;