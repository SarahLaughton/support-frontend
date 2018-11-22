// @flow

// ----- Imports ----- //

import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { type Action as UserAction } from 'helpers/user/userActions';
import { formElementIsValid, getForm } from 'helpers/checkoutForm/checkoutForm';
import { contributionTypeIsRecurring } from 'helpers/contributions';
import type { State } from './contributionsLandingReducer';
import {
  type Action as ContributionsLandingAction,
  setFormIsValid,
} from './contributionsLandingActions';

// ----- Types ----- //

type Action = ContributionsLandingAction | UserAction;

// ----- Functions ----- //

const enableOrDisablePayPalExpressCheckoutButton = (formIsSubmittable: boolean) => {
  if (formIsSubmittable && window.enablePayPalButton) {
    window.enablePayPalButton();
  } else if (window.disablePayPalButton) {
    window.disablePayPalButton();
  }
};

const setFormIsSubmittable = (formIsSubmittable: boolean): Action => {
  enableOrDisablePayPalExpressCheckoutButton(formIsSubmittable);
  return ({ type: 'SET_FORM_IS_SUBMITTABLE', formIsSubmittable });
};

function enableOrDisableForm() {
  return (dispatch: Function, getState: () => State): void => {

    const state = getState();
    const { isRecurringContributor, isSignedIn } = state.page.user;
    const { contributionType, userTypeFromIdentityResponse } = state.page.form;

    const userCanContributeWithoutSigningIn = canContributeWithoutSigningIn(
      contributionType,
      isSignedIn,
      userTypeFromIdentityResponse,
    );

    const formIsValid = formElementIsValid(getForm('form--contribution'));
    dispatch(setFormIsValid(formIsValid));

    const shouldBlockExistingRecurringContributor =
      isRecurringContributor && contributionTypeIsRecurring(contributionType);

    const shouldEnable =
      formIsValid
      && userCanContributeWithoutSigningIn
      && !(shouldBlockExistingRecurringContributor);

    dispatch(setFormIsSubmittable(shouldEnable));
  };
}

function setFormSubmissionDependentValue(setStateValue: () => Action) {
  return (dispatch: Function): void => {
    dispatch(setStateValue());
    dispatch(enableOrDisableForm());
  };
}

export { setFormSubmissionDependentValue, enableOrDisableForm };
