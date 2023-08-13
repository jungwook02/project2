// routes/index.js (라우트 설정 파일)
const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller'); // 컨트롤러 경로

// ...

router.post('/save', userController.saveUserData);

// ...
module.exports = router;