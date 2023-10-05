const express = require("express");
const router = express.Router();

const controller = require("../controller/controller");

router.post("/downloadAndUpload", controller.downloadAndUpload);

router.get("/status", controller.getStatus);

module.exports = router;
