// @flow

// ----- Imports ----- //

import { canContributeWithoutSigningIn } from 'helpers/identityApis';
import { type Action as UserAction } from 'helpers/user/userActions';
import { contributionTypeIsRecurring } from 'helpers/contributions';
import {
  checkAmountOrOtherAmount,
  checkEmail,
  checkFirstName,
  checkLastName,
  checkStateIfApplicable,
} from 'helpers/formValidation';
import type { ContributionType, OtherAmounts, SelectedAmounts } from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { CaState, UsState } from 'helpers/internationalisation/country';
import type { State } from './contributionsLandingReducer';
import {
  type Action as ContributionsLandingAction,
  setFormIsValid,
} from './contributionsLandingActions';

// ----- Types ----- //

type Action = ContributionsLandingAction | UserAction;

// ----- Functions ----- //

type FormIsValidParameters = {
  selectedAmounts: SelectedAmounts,
  otherAmounts: OtherAmounts,
  countryGroupId: CountryGroupId,
  contributionType: ContributionType,
  state: UsState | CaState | null,
  firstName: string | null,
  lastName: string | null,
  email: string | null,
}

const getFormIsValid = (formIsValidParameters: FormIsValidParameters) => {
  const {
    selectedAmounts,
    otherAmounts,
    countryGroupId,
    contributionType,
    state,
    firstName,
    lastName,
    email,
  } = formIsValidParameters;

  return checkFirstName(firstName)
    && checkLastName(lastName)
    && checkEmail(email)
    && checkStateIfApplicable(state, countryGroupId)
    && checkAmountOrOtherAmount(selectedAmounts, otherAmounts, contributionType, countryGroupId);
};

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

const formIsValidParameters = (state: State) => ({
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmounts: state.page.form.formData.otherAmounts,
  countryGroupId: state.common.internationalisation.countryGroupId,
  contributionType: state.page.form.contributionType,
  state: state.page.form.formData.state,
  firstName: state.page.form.formData.firstName,
  lastName: state.page.form.formData.lastName,
  email: state.page.form.formData.email,
});


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

    const formIsValid = getFormIsValid(formIsValidParameters(state));
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
