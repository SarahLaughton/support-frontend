// @flow
import { checkoutFormActions } from '../checkoutFormActions';


describe('Checkout form', () => {

  it('should create an action to set the shouldValidate on the checkout form email field', () => {
    const expectedAction = { type: 'SET_EMAIL_SHOULD_VALIDATE' };
    expect(checkoutFormActions().setEmailShouldValidate()).toEqual(expectedAction);
  });

  it('should create an action to set the shouldValidate on the checkout form full name field', () => {
    const expectedAction = { type: 'SET_FULL_NAME_SHOULD_VALIDATE' };
    expect(checkoutFormActions().setFullNameShouldValidate()).toEqual(expectedAction);
  });

});
