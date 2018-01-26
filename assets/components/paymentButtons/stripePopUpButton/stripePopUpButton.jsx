// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgCreditCard } from 'components/svg/svg';
import type { Currency } from 'helpers/internationalisation/currency';
import * as storage from 'helpers/storage';

import {
  setupStripeCheckout,
  openDialogBox,
} from 'helpers/stripeCheckout/stripeCheckout';

// ---- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  amount: number,
  callback: Function,
  closeHandler?: Function,
  currency: Currency,
  email: string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  canOpen?: Function,
};
/* eslint-enable react/no-unused-prop-types */


function isStripeSetup(): boolean {
  return window.StripeCheckout !== undefined;
}


// ----- Component ----- //

const StripePopUpButton = (props: PropTypes) => {

  if (!isStripeSetup()) {
    setupStripeCheckout(props.callback, props.closeHandler, props.currency.iso, props.isTestUser);
  }

  const onClick = () => {
    // Don't open Stripe Checkout for automated tests, call the backend immediately
    if (props.isPostDeploymentTestUser) {
      const testTokenId = 'tok_visa';
      props.callback(testTokenId);
    } else if (props.canOpen && props.canOpen()) {
      storage.setSession('paymentMethod', 'Stripe');
      openDialogBox(props.amount, props.email);
    }
  };

  return (
    <button
      id="qa-pay-with-card"
      className="component-stripe-pop-up-button"
      onClick={onClick}
    >
      Pay with debit/credit card <SvgCreditCard />
    </button>
  );

};

// ----- Default Props ----- //

StripePopUpButton.defaultProps = {
  canOpen: () => true,
  closeHandler: () => {},
};

// ----- Exports ----- //

export default StripePopUpButton;