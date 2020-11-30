'use strict';

const {
  Adapter,
  Device,
  Property,
} = require('gateway-addon');
const fetch = require('node-fetch');

class TVProperty extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);
    this.setCachedValue(propertyDescription.value);
    this.device.notifyPropertyChanged(this);
  }
}

class TVDevice extends Device {
  constructor(adapter, id, deviceDescription) {
    super(adapter, id);
    this.title = deviceDescription.title;
    this.type = deviceDescription.type;
    this['@type'] = deviceDescription['@type'];
    this.description = deviceDescription.description;
    this.config = deviceDescription.config;

    for (const propertyName in deviceDescription.properties) {
      const propertyDescription = deviceDescription.properties[propertyName];
      let property = new TVProperty(this, propertyName, propertyDescription);
      this.properties.set(propertyName, property);
    }

    this.createActions();
  }

  createActions() {
    const actions = this.config.macros || [];
    for (const action of actions) {
      this.addAction(action.macro, {
        title: action.macro,
      });
    }
  }

  async performAction(action) {
    const {
      macros,
      neeoIP,
      neeoRoomID,
      neeoDeviceID,
    } = this.config;

    action.start();

    const macroConfig = macros.find((macroConf) => macroConf.name === action.name);
    const url = `http://${neeoIP}:3000/projects/home/rooms/${neeoRoomID}/devices/${neeoDeviceID}/macros/${macroConfig.macroID}/trigger`;
    try {
      await fetch(url);
    } catch (error) {
      console.error(error);
    }

    action.finish();
  }
}

class TvNeeoAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, 'TvNeeoAdapter', manifest.id);
    const config = manifest.moziot.config;

    const device = new TVDevice(this, 'samsung-tv', {
      '@type': ['OnOffSwitch'],
      title: 'Samsung TV IR',
      description: 'Samsung TV connected through NEEO for IR. Uses actions to dispatch HTTP commands to NEEO.',
      config,
    });

    this.handleDeviceAdded(device);
  }
}

module.exports = TvNeeoAdapter;
