'use strict';

const NeeoAdapter = require('./neeo-adapter');

module.exports = (addonManager, manifest) => {
  new NeeoAdapter(addonManager, manifest);
};
