// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Redirect } from 'react-router';
import { routes } from 'helpers/routes';
import StripePopUpButton from 'components/paymentButtons/stripePopUpButton/stripePopUpButton';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Status } from 'helpers/settings';
import SvgCreditCard from 'components/svgs/creditCard';
import type { OptimizeExperiments } from 'helpers/optimize/optimize';
import GeneralErrorMessage from 'components/generalErrorMessage/generalErrorMessage';
import type { ErrorReason } from 'helpers/errorReasons';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import { type Action as CheckoutAction, setCheckoutFormHasBeenSubmitted } from '../helpers/checkoutForm/checkoutFormActions';
import postCheckout from '../helpers/ajax';
import { type State } from '../oneOffContributionsReducer';
import { formClassName } from './formFields';

// ----- Types ----- //

type PropTypes = {|
  dispatch: Function,
  email: string,
  errorReason: ?ErrorReason,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  stripeSwitchStatus: Status,
  paymentComplete: boolean,
  optimizeExperiments: OptimizeExperiments,
  setCheckoutFormHasBeenSubmitted: () => void,
|};


// ----- Map State/Props ----- //


function mapStateToProps(state: State) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    errorReason: state.page.oneoffContrib.errorReason,
    areAnyRequiredFieldsEmpty: !state.page.user.email || !state.page.user.fullName,
    amount: state.page.oneoffContrib.amount,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    currencyId: state.common.internationalisation.currencyId,
    stripeSwitchStatus: state.common.settings.switches.oneOffPaymentMethods.stripe,
    paymentComplete: state.page.oneoffContrib.paymentComplete || false,
    optimizeExperiments: state.common.optimizeExperiments,
  };
}

function mapDispatchToProps(dispatch: Dispatch<CheckoutAction>) {
  return {
    dispatch,
    setCheckoutFormHasBeenSubmitted: () => {
      dispatch(setCheckoutFormHasBeenSubmitted());
    },
  };
}

// ----- Component ----- //

/*
 * WARNING: we are using the React context here to be able to pass the getState function
 * to the postCheckout function. PostCheckout requires this function to access to the
 * most recent user.
 * More information here:https://reactjs.org/docs/context.html
 * You should not use context for other purposes. Please use redux.
 */
function OneoffContributionsPayment(props: PropTypes, context) {
  return (
    <section className="oneoff-contribution-payment">
      { props.paymentComplete ? <Redirect to={{ pathname: routes.oneOffContribThankyou }} /> : null }
      <GeneralErrorMessage errorReason={props.errorReason} />
      <StripePopUpButton
        email={props.email}
        onPaymentAuthorisation={postCheckout(
          props.abParticipations,
          props.dispatch,
          props.amount,
          props.currencyId,
          props.referrerAcquisitionData,
          context.store.getState,
          props.optimizeExperiments,
        )}
        canOpen={() => formIsValid(formClassName)}
        whenUnableToOpen={() => props.setCheckoutFormHasBeenSubmitted()}
        currencyId={props.currencyId}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        amount={props.amount}
        switchStatus={props.stripeSwitchStatus}
        svg={<SvgCreditCard />}
      />
    </section>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
