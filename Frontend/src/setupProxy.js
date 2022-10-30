const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/tracing',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/researcher',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/medical',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/token',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
  app.use(
    '/stats',
    createProxyMiddleware({
      target: 'http://http://172.25.76.159:4000',
      changeOrigin: true,
    })
  );
};