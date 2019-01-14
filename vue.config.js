module.exports = {
  chainWebpack: (config) => {
    config.module.rule('images').test(/\.(png|jpg|gif)$/i).use('url-loader').loader('url-loader').options({ limit: 100000 });
  },
};
