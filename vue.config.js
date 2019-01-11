module.exports = {
  chainWebpack: (config) => {
    config.module('url-loader')
      .test(/\.(png|jpg|gif)$/i)
      .use('url-loader')
      .loader('url-loader')
      .end();
  },
};
