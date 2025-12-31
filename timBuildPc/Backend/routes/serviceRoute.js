const express = require('express');
const multer = require ("multer");
const router = express.Router();

const { uploadMiddleware, setServicePic, createService,getServiceCard } = require("../controllers/serviceController.js")

// const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload/img", uploadMiddleware,setServicePic);
router.post("/craeteService", createService)
router.post("/findDoc", getServiceCard)

module.exports = router;