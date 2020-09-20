import React from 'react'
import { shallow, mount } from 'enzyme'
import DashboardComponent from '../app/components/DashboardComponent.js';
import moment from 'moment';

global.chrome = {
  storage: {
    local: { get: jest.fn() },
    sync: { get: jest.fn() }
  }
}

describe('DashboardComponent.js', () => {
  var component, localData;

  beforeEach(() => {
    component = mount(<DashboardComponent />);

    localData = {
      'paidDomains': [
        {
          'domainName': 'www.test.ccom',
          'address': 0x028D27E4D42171c432Bf2631dC685d1909C8Cb30,
          'cost': '0.2',
          'time': new Date().subtractHours(10).toISOString()
        },
        {
          'domainName': 'www.example.com',
          'address': 0xce19aCda2A41ee210E630B3D811739a09725E083,
          'cost': '0.25',
          'time': new Date().subtractHours(8).toISOString()
        },
        {
          'domainName': 'www.google.ccom',
          'address': 0xa6d291a401b8De752BA848E3b30541d751d5288F,
          'cost': '0.15',
          'time': new Date().subtractHours(6).toISOString()
        },
        {
          'domainName': 'www.youtube.ccom',
          'address': 0x97f2fb1F608446742bb420b64D236c690F1B9210,
          'cost': '0.12',
          'time': new Date().subtractHours(4).toISOString()
        },
        {
          'domainName': 'www.reddit.ccom',
          'address': 0xa8164e24D5B70E1BA65062b1c6326f2131C59205,
          'cost': '0.2',
          'time': new Date().subtractHours(3.5).toISOString()
        },
        {
          'domainName': 'www.twitter.ccom',
          'address': 0xdbD4407418F78f8e6Ee9Df59C463Dc94dF10AA88,
          'cost': '0.2',
          'time': new Date().subtractHours(3).toISOString()
        },
        {
          'domainName': 'www.facebook.ccom',
          'address': 0x0E13e824151B2aEc201950603D1F4dc1A65B3684,
          'cost': '0.2',
          'time': new Date().subtractHours(2.5).toISOString()
        },
        {
          'domainName': 'www.apple.ccom',
          'address': 0x103052b525D97F938893CD51F0982691eF974939,
          'cost': '0.2',
          'time': new Date().subtractHours(2).toISOString()
        },
        {
          'domainName': 'www.instagram.ccom',
          'address': 0xFB091F638fD2A32e9dC8660d3fbC4bc48F62763d,
          'cost': '0.2',
          'time': new Date().subtractHours(1.5).toISOString()
        },
        {
          'domainName': 'www.stackoverflow.ccom',
          'address': 0x6933E19c66752c1122F764068F75eC44D9E4Ed9c,
          'cost': '0.2',
          'time': new Date().subtractHours(1).toISOString()
        },
        {
          'domainName': 'www.messengers.ccom',
          'address': 0x87BdA26e4650876edd875D07Ef9D7AEdfaC1A89B,
          'cost': '0.2',
          'time': new Date().toISOString()
        }
      ]
    };
  });

  afterEach(() => {
    component.unmount();
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should display transactions correctly', async () => {
    global.chrome.storage.local.get = jest.fn((data, callback) => {
     callback(localData);
    });

    await component.instance().updateTransactions();
    await component.update();

    const transactionList = component.find('tr');
    var i = 0;
    transactionList.map(transaction => {
      const expectedTransaction = localData.paidDomains[i]
      const expectedString = `${expectedTransaction.domainName},` +
        `${expectedTransaction.cost} ETH, ` +
        `${moment(expectedTransaction.time).fromNow()}`;
      i += 1;
      expect(transaction.text()).toBe(expectedString)
    })
  });

  it('should paginate data correctly', async () => {
    global.chrome.storage.local.get = jest.fn((data, callback) => {
     callback(localData);
    });

    await component.instance().updateTransactions();
    await component.instance().changePage(1)
    await component.update();

    const transactionList = component.find('tr');
    var i = 10;
    transactionList.map(transaction => {
      const expectedTransaction = localData.paidDomains[i]
      const expectedString = `${expectedTransaction.domainName},` +
        `${expectedTransaction.cost} ETH, ` +
        `${moment(expectedTransaction.time).fromNow()}`;
      i += 1;
      expect(transaction.text()).toBe(expectedString)
    })
  });
});

Date.prototype.subtractHours = function(h) {
    this.setHours(this.getHours() - h);
    return this;
}
