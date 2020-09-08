import { Ethereum } from '../app/services/ethereum.js'
const eth = new Ethereum()

describe('ethereum.js', () => {

  test('getEth() converts 4 ETH to wei', () => {
    let expectedValue = 4 * Math.pow(10, 18);
    expect(eth.getEth(4)).toBe(expectedValue);
  });

});

