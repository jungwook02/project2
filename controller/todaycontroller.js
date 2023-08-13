const axios = require('axios');

// API 주소
const apiUrl = 'https://api.odcloud.kr/api/gov24/v3/serviceList';
const serviceKey = '4EypLl%2BK4mE8CnrH%2FNTpoDUHAErJ3B71URFE8WKldsYr4RHD%2FfNwtJ3%2BB%2Bi4eHX3lkw572xypYaPfGEqdFnCYw%3D%3D';

// 첫 번째 서비스 정보 가져오기
exports.getFirstService = async (req, res) => {
  try {
    // API 요청
    const response = await axios.get(`${apiUrl}?serviceKey=${serviceKey}`);

    // 응답 데이터 중 첫 번째 서비스 정보 추출
    const firstService = response.data.data[0];

    // JSON 형태로 출력
    res.json(firstService);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
