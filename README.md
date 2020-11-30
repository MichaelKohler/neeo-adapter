# Samsung TV through NEEO Adapter

This is an adapter for the [Mozilla IoT gateway](https://iot.mozilla.org). There is some doubt on whether this adapter provides you any benefit.

This adapter exposes actions for the IR commands I need (very specific to my user case). Every IR command has an action, which can be configured in the configuration. Using shortcuts in the NEEO app simplifies this as there will be a single GET HTTP request to be triggered.

## Setup
1. Set up the NEEO and add the TV to it.
2. Add the NEEO IP to the add-on configuration (Settings → Add-ons → Samsung TV NEEO Adapter → Configure.
4. You should now see the TV in the discovered devices.
