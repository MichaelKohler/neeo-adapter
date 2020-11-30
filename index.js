'use strict';

const TVNeeoAdapter = require('./tv-neeo-adapter');

module.exports = (addonManager, manifest) => {
  new TVNeeoAdapter(addonManager, manifest);
};
