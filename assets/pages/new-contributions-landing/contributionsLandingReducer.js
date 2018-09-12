// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';
import { type PaymentMethod } from 'helpers/checkouts';
import { amounts, type Amount, type Contrib } from 'helpers/contributions';
import { type CommonState } from 'helpers/page/page';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { createUserReducer, type User as UserState } from 'helpers/user/userReducer';

import { type Action } from './contributionsLandingActions';

// ----- Types ----- //

type FormState = {
  contributionType: Contrib,
  paymentMethod: PaymentMethod,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
  done: boolean,
};

type PageState = {
  form: FormState,
  user: UserState,
};

export type State = {
  common: CommonState,
  page: PageState,
};

// ----- Initial state ----- //

// ----- Functions ----- //

function createFormReducer(countryGroupId: CountryGroupId) {
  const amountsForCountry: { [Contrib]: Amount[] } = {
    ONE_OFF: amounts('notintest').ONE_OFF[countryGroupId],
    MONTHLY: amounts('notintest').MONTHLY[countryGroupId],
    ANNUAL: amounts('notintest').ANNUAL[countryGroupId],
  };

  const initialAmount: { [Contrib]: Amount | 'other' } = {
    ONE_OFF: amountsForCountry.ONE_OFF.find(amount => amount.isDefault) || amountsForCountry.ONE_OFF[0],
    MONTHLY: amountsForCountry.MONTHLY.find(amount => amount.isDefault) || amountsForCountry.MONTHLY[0],
    ANNUAL: amountsForCountry.ANNUAL.find(amount => amount.isDefault) || amountsForCountry.ANNUAL[0],
  };

  const initialState: FormState = {
    contributionType: 'MONTHLY',
    paymentMethod: 'Stripe',
    selectedAmounts: initialAmount,
    otherAmount: null,
    done: false,
  };

  return function formReducer(state: FormState = initialState, action: Action): FormState {
    switch (action.type) {
      case 'UPDATE_CONTRIBUTION_TYPE':
        return {
          ...state,
          contributionType: action.contributionType,
          showOtherAmount: false,
        };

      case 'UPDATE_PAYMENT_METHOD':
        return { ...state, paymentMethod: action.paymentMethod };

      case 'SELECT_AMOUNT':
        return {
          ...state,
          selectedAmounts: { ...state.selectedAmounts, [action.contributionType]: action.amount },
        };

      case 'UPDATE_OTHER_AMOUNT':
        return { ...state, otherAmount: action.otherAmount };

      case 'PAYMENT_FAILURE':
        return { ...state, done: false, error: action.error };

      case 'PAYMENT_SUCCESS':
        return { ...state, done: true };

      default:
        return state;
    }
  };
}

function initReducer(countryGroupId: CountryGroupId) {

  return combineReducers({
    form: createFormReducer(countryGroupId),
    user: createUserReducer(countryGroupId),
  });
}


// ----- Reducer ----- //

export { initReducer };
