const express = require('express');
const passport = require('passport');
const router = express.Router();
const path = require('path');
const User = require('../models/user'); // 사용자 정보 관련 모듈 경로

// /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/auth/login',
}), async (req, res) => {
    const user = req.user; // Passport가 세션에 저장한 사용자 정보
    if (user) {
        try {
            const userInfo = await User.getUserInfo(user.kakao_id); // 사용자 정보 조회 함수
            if (!userInfo || (!userInfo.house && !userInfo.target)) {
                res.render('add_data.ejs'); // house 또는 target 정보가 없으면 add_data.ejs를 렌더링
            } else {
                res.redirect('/'); // house와 target 정보가 있으면 '/' 라우트로 리다이렉션
            }
        } catch (err) {
            console.error('Error fetching user information:', err);
            res.redirect('/auth/login');
        }
    } else {
        res.redirect('/auth/login'); // 사용자 정보가 없으면 로그인 페이지로 리다이렉션
    }
});

// /auth/login
router.get('/login', (req, res) => {
    // 로그인 페이지를 렌더링
    res.render('login.ejs'); // 로그인 페이지의 뷰 이름을 올바르게 수정해주세요.
});

module.exports = router;
