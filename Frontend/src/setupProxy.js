const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
  app.use(
    '/tracing/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
  app.use(
    '/researcher/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
  app.use(
    '/user/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
  app.use(
    '/medical/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
  app.use(
    '/token/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
  app.use(
    '/stats/',
    createProxyMiddleware({
      target: 'http://172.25.76.159:4000',
      changeOrigin: true,
      xfwd: true,
    })
  );
};