const mysql = require('mysql2');

// DB 설정한 부분 이 부분만 수정하면됨
const connection = mysql.createConnection({
    host: 3306,
    user: 'park',
    password: '2002',
    database: 'kakao',
    
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

const User = {
    saveUserInfo: function (userInfo, callback) {
        const sqlSelectUser = 'SELECT * FROM users WHERE kakao_id = ?';
        connection.query(sqlSelectUser, [userInfo.kakao_id], (err, result) => {
            if (err) {
                return callback(err);
            }
            if (result.length > 0) {
                console.log('이미 동일한 kakao_id를 가진 사용자가 존재합니다:');
                console.log(result[0]);
                return callback(null, result[0]);
            } else {
                const sqlInsertUser = 'INSERT INTO users (kakao_id, name, age_range, gender, house, target) VALUES (?, ?, ?, ?, ?, ?)';
                const values = [
                    userInfo.kakao_id,
                    userInfo.name,
                    userInfo.age_range || null,
                    userInfo.gender || null,
                    userInfo.house || null,
                    userInfo.target || null,
                ];
                connection.query(sqlInsertUser, values, (err, result) => {
                    if (err) {
                        return callback(err);
                    }
                    console.log('새로운 사용자 정보가 성공적으로 저장되었습니다!');
                    return callback(null, result);
                });
            }
        });
    },

    getUserInfo: function (kakao_id) {
        return new Promise((resolve, reject) => {
            const sqlSelectUser = 'SELECT * FROM users WHERE kakao_id = ?';
            connection.query(sqlSelectUser, [kakao_id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.length > 0) {
                    resolve(result[0]);
                } else {
                    resolve(null);
                }
            });
        });
    },

    saveUserData: function (userData, callback) {
        const { kakao_id, house, target } = userData;
    
        const insertQuery = `
            INSERT INTO users (kakao_id, house, target)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                house = VALUES(house),
                target = VALUES(target)
        `;
    
        connection.query(insertQuery, [kakao_id, house, target], (err, result) => {
            if (err) {
                console.error('Error inserting data into database:', err);
                return callback(err);
            }
    
            if (result.affectedRows > 0) {
                console.log('Data inserted or updated into database');
                if (result.insertId) {
                    console.log('Insert ID:', result.insertId);
                }
            } else {
                console.log('Data for this kakao_id already exists in the database');
            }
    
            return callback(null, result);
        });
    }
    
    
    
};

module.exports = User;