var webpack = require('webpack'),
  config = require('../webpack.config');

//delete config.chromeExtensionBoilerplate;

webpack(config, function (err) {
  if (err) {
    console.log(err);
    throw err;
  }
});
