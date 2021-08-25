/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.security = {
    csrf: {
      enable: false
    }
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1624951166916_1319';

  // add your middleware config here
  config.middleware = [
    'errorHandler'
  ];

  config.mongoose = {
    url: "mongodb://127.0.0.1:27017/melon",
    options: {
      useCreateIndex: true,
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  }
  config.cors = {
    origin: '*', //允许所有跨域访问，注释掉则允许上面 白名单 访问
    credentials: true, // 允许跨域请求携带cookies
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
