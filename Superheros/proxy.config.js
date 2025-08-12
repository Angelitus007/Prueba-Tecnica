const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:3000',
    secure: false,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
    logLevel: 'info'
  }
];

module.exports = PROXY_CONFIG;
