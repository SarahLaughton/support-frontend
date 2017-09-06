// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import { abTestReducer as abTests } from 'helpers/abtest';
import { intCmpReducer as intCmp } from 'helpers/tracking/guTracking';
import type { Contrib, ContribError, Amounts } from 'helpers/contributions';

import { parse as parseContribution } from 'helpers/contributions';
import type { Action } from '../actions/bundlesLandingActions';


// ----- Types ----- //

export type ContribState = {
  type: Contrib,
  error: ?ContribError,
  amount: Amounts,
};


// ----- Setup ----- //

const initialContrib: ContribState = {
  type: 'ANNUAL',
  error: null,
  amount: {
    annual: {
      value: '75',
      userDefined: false,
    },
    monthly: {
      value: '10',
      userDefined: false,
    },
    oneOff: {
      value: '50',
      userDefined: false,
    },
  },
};


// ----- Reducers ----- //

function contribution(
  state: ContribState = initialContrib,
  action: Action): ContribState {

  switch (action.type) {

    case 'CHANGE_CONTRIB_TYPE': {

      let amount;

      if (action.contribType === 'ONE_OFF') {
        amount = state.amount.oneOff.value;
      } else if (action.contribType === 'ANNUAL'){
        amount = state.amount.annual.value;
      } else {
        amount = state.amount.monthly.value;
      }

      return Object.assign({}, state, {
        type: action.contribType,
        error: parseContribution(amount, action.contribType).error,
      });

    }

    case 'CHANGE_CONTRIB_AMOUNT':

      return Object.assign({}, state, {
        amount: { annual: action.amount, monthly: action.amount, oneOff: action.amount },
        error: parseContribution(action.amount.value, state.type).error,
      });

    case 'CHANGE_CONTRIB_AMOUNT_ANNUAL':

      return Object.assign({}, state, {
        amount: { annual: action.amount, monthly: state.amount.monthly, oneOff: state.amount.oneOff },
        error: parseContribution(action.amount.value, state.type).error,
      });

    case 'CHANGE_CONTRIB_AMOUNT_MONTHLY':

      return Object.assign({}, state, {
        amount: { annual: state.amount.annual, monthly: action.amount, oneOff: state.amount.oneOff },
        error: parseContribution(action.amount.value, state.type).error,
      });

    case 'CHANGE_CONTRIB_AMOUNT_ONEOFF':

      return Object.assign({}, state, {
        amount: { annual: state.amount.annual, monthly: state.amount.monthly, oneOff: action.amount },
        error: parseContribution(action.amount.value, state.type).error,
      });

    default:
      return state;

  }

}

// ----- Exports ----- //

export default combineReducers({
  contribution,
  intCmp,
  abTests,
});
