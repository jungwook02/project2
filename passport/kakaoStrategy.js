// passport/kakaoStrategy.js
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: 'http://localhost:3000/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const userInfo = {
                kakao_id: profile.id.toString(),
                name: profile.username,
                age_range: profile._json.kakao_account?.age_range || null,
                gender: profile._json.kakao_account?.gender || null,
            };
            
            //user.js에서 사용자 정보 조회 후 정보 있으면 출력
            User.saveUserInfo(userInfo, (err, user) => {
                if (err) {
                    console.error('Error fetching user information from Kakao:', err);
                    return done(err);
                }

                if (user && user.exists) {
                    console.log('이미 동일한 kakao_id를 가진 사용자가 존재합니다:');
                    console.log(user);
                    return done(null, user);
                } else {
                    
                    return done(null, userInfo);
                }
            });
        } catch (err) {
            console.error('Error fetching user information from Kakao:', err);
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.kakao_id);
    });
    

    passport.deserializeUser((kakao_id, done) => {
        done(null, { kakao_id });
    });
};
