'use strict';

const Homey = require('homey');
const sectoralarm = require('sectoralarm');

class MyDriver extends Homey.Driver {

  async onInit() {
    this.log('Yale Doorman driver has been initialized');
  }

  async onPairListDevices() {
    const username = this.homey.settings.get('username');
    const password = this.homey.settings.get('password');
    if (username === '' || password === '') {
      throw new Error('No credentials, please enter credentials in settings.');
    }

    const devices = [];
    await sectoralarm.connect(username, password, null, null)
      .then(async site => {
        await site.status()
          .then(async status => {
            this.log(status);
            const statusObject = JSON.parse(status);
            if (this.homey.settings.get('siteid') === '') {
              this.homey.settings.set('siteid', statusObject.siteId);
            }
            if (statusObject.locks) {
              this.log('a');
              statusObject.locks.forEach(lock => {
                this.log('b');
                devices.push(
                  {
                    name: lock.label,
                    data: { id: lock.serial },
                  },
                );
              });
            }
          });
      });
    this.log('d');
    return devices;
    // return [{
    //   name: 'Fake',
    //   data: { id: 1 },
    // }];
  }

}

module.exports = MyDriver;
