'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/vue2-ngw-map.esm-bundler.js');
} else {
  module.exports = require('./lib/vue2-ngw-map.esm-bundler.prod.js');
}
