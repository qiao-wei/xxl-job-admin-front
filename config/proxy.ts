/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/rest/': {
      target: 'http://localhost:8080/xxl-job-admin',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/xxl-job-admin/jobcode/save': {
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/jobcode': {
      target: 'http://localhost:8080/xxl-job-admin',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/xxl-job-admin/static': {
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
