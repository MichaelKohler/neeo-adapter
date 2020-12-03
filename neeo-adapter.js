'use strict';

const {
  Adapter,
  Device,
  Property,
} = require('gateway-addon');
const fetch = require('node-fetch');

class NeeoProperty extends Property {
  constructor(device, name, propertyDescription) {
    super(device, name, propertyDescription);
    this.setCachedValue(propertyDescription.value);
    this.device.notifyPropertyChanged(this);
  }
}

class NeeoDevice extends Device {
  constructor(adapter, id, deviceDescription) {
    super(adapter, id);
    this.title = deviceDescription.title;
    this.type = deviceDescription.type;
    this['@type'] = deviceDescription['@type'];
    this.description = deviceDescription.description;
    this.config = deviceDescription.config;
    this.neeoIP = deviceDescription.neeoIP;

    for (const propertyName in deviceDescription.properties) {
      const propertyDescription = deviceDescription.properties[propertyName];
      const property = new NeeoProperty(this, propertyName, propertyDescription);
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
      neeoRoomID,
      neeoDeviceID,
    } = this.config;

    action.start();

    const macroConfig = macros.find((macroConf) => macroConf.macro === action.name);
    const url = `http://${this.neeoIP}:3000/projects/home/rooms/${neeoRoomID}/devices/${neeoDeviceID}/macros/${macroConfig.macroID}/trigger`;
    try {
      await fetch(url);
    } catch (error) {
      console.error(error);
    }

    action.finish();
  }
}

class NeeoAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, 'NeeoAdapter', manifest.id);
    addonManager.addAdapter(this);

    const { devices = [], neeoIP } = manifest.moziot.config;

    for (const device of devices) {
      const neeoDevice = new NeeoDevice(this, device.name, {
        '@type': device.type && device.type.replace(', ', ',').split(','),
        title: device.title,
        description: device.description,
        config: device,
        neeoIP,
      });

      this.handleDeviceAdded(neeoDevice);
    }
  }
}

module.exports = NeeoAdapter;
