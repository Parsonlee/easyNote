const router = require('koa-router')();
const sqlFn = require('../mysql');
const jwt = require('jsonwebtoken');
const config = require('../config');

//登录
router.post('/login', async (ctx) => {
	const { username, password } = ctx.request.body;
	const sql = 'SELECT * FROM user WHERE `username` = ? AND `password` = ?';
	const arr = [username, password];

	const results = await sqlFn(sql, arr);
	if (results && results.length) {
		const token = jwt.sign(
			{
				userid: results[0].id,
				username: results[0].username,
			},
			config.jwtSecret,
			// { expiresIn: 10 }
		);
		ctx.body = { token };
	} else {
		ctx.throw(403, '用户名或密码错误');
	}
});

module.exports = router;
