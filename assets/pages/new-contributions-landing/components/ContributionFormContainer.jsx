// @flow

// ----- Imports ----- //

import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButtonNewFlow';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import type { Csrf as CsrfState, Csrf } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type PaymentMethod } from 'helpers/contributions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import DirectDebitPopUpForm from 'components/directDebit/directDebitPopUpForm/directDebitPopUpForm';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';

import { type State } from '../contributionsLandingReducer';
import { NewContributionForm } from './ContributionForm';
import { setPayPalHasLoaded } from '../contributionsLandingActions';

import {
  paymentWaiting,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
  processPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  csrf: Csrf,
  payPalHasLoaded: boolean,
  paymentComplete: boolean,
  payPalSwitchStatus: Status,
  paymentError: CheckoutFailureReason | null,
  currencyId: IsoCurrency,
  countryGroupId: CountryGroupId,
  isDirectDebitPopUpOpen: boolean,
  thankYouRoute: string,
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  setCheckoutFormHasBeenSubmitted: () => void,
  openDirectDebitPopUp: () => void,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  payPalSetHasLoaded: () => void,
  isTestUser: boolean,
  processPayPalPayment: (Function, Function, IsoCurrency, CsrfState) => void,
|};

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  csrf: state.page.csrf,
  payPalHasLoaded: state.page.form.payPalHasLoaded,
  paymentComplete: state.page.form.paymentComplete,
  payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
  paymentError: state.page.form.paymentError,
  currencyId: state.common.internationalisation.currencyId,
  countryGroupId: state.common.internationalisation.countryGroupId,
  isDirectDebitPopUpOpen: state.page.directDebit.isPopUpOpen,
  isTestUser: state.page.user.isTestUser,
});

const mapDispatchToProps = (dispatch: Function) => ({

  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
  payPalSetHasLoaded: () => { dispatch(setPayPalHasLoaded()); },
  processPayPalPayment: (resolve: Function, reject: Function, currencyId: IsoCurrency, csrf: Csrf) => { dispatch(processPayPalPayment(resolve, reject, currencyId, csrf)); },
});

// ----- Render ----- //

function ContributionFormContainer(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const showPayPalExpressButton = true;
  const formClassName = 'form--contribution';
  const selectedCountryGroupDetails = countryGroupSpecificDetails[props.countryGroupId];


  return props.paymentComplete ?
    <Redirect to={props.thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1 className="header">{countryGroupSpecificDetails[props.countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[props.countryGroupId].contributeCopy}</p>
        <NewContributionForm
          selectedCountryGroupDetails={selectedCountryGroupDetails}
        />
        <DirectDebitPopUpForm
          onPaymentAuthorisation={onPaymentAuthorisation}
          isPopUpOpen={props.isDirectDebitPopUpOpen}
        />
        <PayPalExpressButton
          currencyId={props.currencyId}
          csrf={props.csrf}
          onPaymentAuthorisation={onPaymentAuthorisation}
          hasLoaded={props.payPalHasLoaded}
          setHasLoaded={props.payPalSetHasLoaded}
          switchStatus={props.payPalSwitchStatus}
          canOpen={() => formIsValid(formClassName)}
          formClassName={formClassName}
          whenUnableToOpen={() => props.setCheckoutFormHasBeenSubmitted()}
          show={showPayPalExpressButton}
          isTestUser={props.isTestUser}
          processPayPalPayment={props.processPayPalPayment}
        />
      </div>
    );
}

const NewContributionFormContainer = connect(mapStateToProps, mapDispatchToProps)(ContributionFormContainer);

export { NewContributionFormContainer };