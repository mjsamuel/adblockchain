import { Ethereum } from '../app/services/ethereum.js'
const Web3 = require('web3');
const eth = new Ethereum()

describe('getEth()', () => {
  it('should converts 4 ETH to wei', () => {
    let expectedValue = 4 * Math.pow(10, 18);
    expect(eth.getEth(4)).toBe(expectedValue);
  });
});

describe('validateCredentials() ', () => {
  it('should return no errors when the credentials are valid', async () => {
    const errors = await eth.validateCredentials(
      '0x561D1D62083eBE58FFdcCBD283791f98d19a0AF0', 
      '4340d1b573900ee014ef617905c127ca28f4e1ce2fa33ed7e7bf01ea1a17474e');
    expect(errors.length).toBe(0);
  });

  it('should return an error when the private key does not correspond to the public key', async () => {
    const errors = await eth.validateCredentials(
      '0x561D1D62083eBE58FFdcCBD283791f98d19a0AF0', 
      '22475a00da34f9752795031ab11f5628bbbafb5d4c8e40c86b04eee06b590d3a');
    expect(errors[0]).toBe('Private key does not correspond to public key');
  });

  it('should return errors when either key is empty', async () => {
    const errors = await eth.validateCredentials(
      '', 
      '');
    expect(errors[0]).toBe('Public key is empty');
    expect(errors[1]).toBe('Private key is empty');
  });

  it('should return errors when either key is invalid', async () => {
    const errors = await eth.validateCredentials(
      'invalid_key', 
      'invalid_key');
    expect(errors[0]).toBe('Public key is invalid');
    expect(errors[1]).toBe('Private key is invalid');
  });
});

