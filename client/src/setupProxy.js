const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/dev',
        createProxyMiddleware({
            target: 'https://u0fq9wg435.execute-api.us-east-1.amazonaws.com',
            changeOrigin: true,
        })
    );
};
// target을 통해 node와 연결시킬 수 있다
// 이렇게 proxy를 이용해야지 서로 req res가 가능하다
