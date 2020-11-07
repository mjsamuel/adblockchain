import React from 'react'
import { shallow, mount } from 'enzyme'
import LoginComponent from '../app/components/LoginComponent.js';
import { Ethereum } from '../app/services/ethereum.js'

describe('LoginComponent.js', () => {
  var component;

  beforeEach(() => {
    component = mount(<LoginComponent />);
  });

  afterEach(() => {
    component.unmount();
  });

  it('should render correctly', () => {
    expect(component).toMatchSnapshot();
  });

  it('should display alerts when an error occurs', async () => { 
    component.setState({publicKey: '', privateKey: ''})
    await component.instance().submitClicked();
    await component.update();
    const errorList = component.find('li');

    expect(errorList.at(0).text()).toBe('Public key is empty')
    expect(errorList.at(1).text()).toBe('Private key is empty')
  });

});
