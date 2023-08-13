const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const passport = require('passport');
const dotenv = require('dotenv');
const User = require('./models/user'); // user.js 파일의 경로를 정확하게 입력해야 합니다.
const todaycontroller = require('./controller/todaycontroller');

const app = express();
const port = 3000; // 포트 번호는 필요에 따라 변경하세요

// 환경 변수 설정 (dotenv 사용)
dotenv.config();

// body-parser 미들웨어 등록
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// nunjucks 설정 부분 활성화
app.set('view engine', 'ejs'); // EJS 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 템플릿 파일이 위치한 디렉토리 설정
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

// session 미들웨어 등록
app.use(session({
  secret: 'YourSecretKey', // 세션 데이터 암호화에 사용되는 비밀키
  resave: false,
  saveUninitialized: false,
}));

// Passport 미들웨어 등록 (express-session 뒤에 위치해야 함)
app.use(passport.initialize());
app.use(passport.session());

// passport-kakao 인증 전략 등록
require('./passport/kakaoStrategy')(); // 실제 파일 경로로 대체해야 합니다.

// 정적 파일 미들웨어 등록 (express.static는 라우팅 미들웨어보다 앞에 위치해야 함)
app.use(express.static(path.join(__dirname, 'public'))); // public 폴더에 정적 파일을 넣으세요.

// auth.js 파일을 올바르게 가져와서 kakaoRoutes 변수에 할당합니다.
const kakaoRoutes = require('./routes/auth.js');

// '/auth' 경로로 kakaoRoutes를 사용하기 위해 미들웨어로 등록
app.use('/auth', kakaoRoutes); // 카카오 로그인 관련 라우터

// 루트 경로로 접근할 때 index.ejs 파일을 렌더링
app.get('/', (req, res) => {
    res.render('index', { userAuthenticated: req.isAuthenticated() });
});

// add_data.ejs 페이지를 렌더링하는 라우트
app.get('/add-data', (req, res) => {
  res.render('add_data.ejs'); // 여기서 'add_data.ejs' 파일을 렌더링하는 로직을 사용하면 됩니다.
});



// 데이터 저장 API
app.post('/save', (req, res) => {
    const house = req.body.house;
    const target = req.body.target;
    const kakaoId = req.session.passport.user;

    if (!kakaoId) {
        res.status(401).send('Unauthorized');
        return;
    }

    User.saveUserData({
        kakao_id: kakaoId,
        house,
        target,
       
    }, (err, result) => {
        if (err) {
            console.error('Error saving user data:', err);
            res.status(500).send('Error saving user data');
            return;
        }
        res.status(201).json({ message: 'User data saved successfully.' });
    });
});
app.get('/info', (req, res) => {
    const kakaoId = req.session.passport.user; // 로그인한 사용자의 카카오 아이디 정보를 사용하세요
  
    if (!kakaoId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  
    // User 모델의 getUserInfo 메서드를 호출하여 사용자 정보 조회
    User.getUserInfo(kakaoId)
      .then(userInfo => {
        if (userInfo) {
          // 사용자 정보가 있는 경우 JSON 형식으로 응답
          res.json(userInfo);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      })
      .catch(err => {
        console.error('Error fetching user information:', err);
        res.status(500).json({ error: 'An error occurred while fetching user information' });
      });
});
  


// 서버 포트 설정 및 서버 시작
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
app.get('/1', todaycontroller.getFirstService);