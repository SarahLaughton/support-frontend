// @flow

// ----- Imports ----- //

import { addQueryParamToURL } from 'helpers/url';
import { routes } from 'helpers/routes';
import type { UsState } from 'helpers/internationalisation/country';
import type { PageState } from '../regularContributionsReducers';
import type { BillingPeriod, Contrib } from '../../../helpers/contributions';

import { checkoutError, setStatusUri, incrementPollCount, resetPollCount, creatingContributor } from '../regularContributionsActions';
import { billingPeriodFromContrib } from '../../../helpers/contributions';


// ----- Setup ----- //

const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;


// ----- Types ----- //

type RegularContribFields = {
  contribution: {
    amount: number,
    currency: string,
    billingPeriod: BillingPeriod,
  },
  paymentFields: {
    stripeToken: string,
  },
  state?: UsState,
  firstName: ?string,
  lastName: ?string,
};

type PaymentField = 'baid' | 'stripeToken';


// ----- Functions ----- //

function requestData(paymentFieldName: PaymentField,
  token: string,
  contributionType: Contrib,
  getState: () => PageState) {

  const state = getState().page;
  const country = getState().common.country;

  if (state.user.firstName !== null && state.user.firstName !== undefined
    && state.user.lastName !== null && state.user.lastName !== undefined
    && state.user.email !== null && state.user.email !== undefined) {
    const regularContribFields: RegularContribFields = {
      contribution: {
        amount: state.stripeCheckout.amount,
        currency: state.stripeCheckout.currency,
        billingPeriod: billingPeriodFromContrib(contributionType),
      },
      paymentFields: {
        [paymentFieldName]: token,
      },
      country,
      firstName: state.user.firstName,
      lastName: state.user.lastName,
    };

    if (state.user.stateField) {
      regularContribFields.state = state.user.stateField;
    }

    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.csrf.token || '' },
      credentials: 'same-origin',
      body: JSON.stringify(regularContribFields),
    };
  }

  return Promise.resolve({
    ok: false,
    text: () => 'Failed to process payment - missing fields',
  });
}

function statusPoll(dispatch: Function, getState: Function) {
  const state = getState();

  if (state.page.regularContrib.pollCount >= MAX_POLLS) {
    const url: string = addQueryParamToURL(routes.recurringContribPending, 'INTCMP', state.common.intCmp);
    window.location.assign(url);
  }

  dispatch(incrementPollCount());

  const request = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Csrf-Token': state.page.csrf.token },
    credentials: 'same-origin',
  };

  return fetch(state.page.regularContrib.statusUri, request).then((response) => {
    handleStatus(response, dispatch, getState); // eslint-disable-line no-use-before-define
  });
}

function delayedStatusPoll(dispatch: Function, getState: Function) {
  setTimeout(() => statusPoll(dispatch, getState), POLLING_INTERVAL);
}

function handleStatus(response: Response, dispatch: Function, getState: Function) {
  const state = getState();
  if (response.ok) {
    response.json().then((status) => {
      dispatch(setStatusUri(status.trackingUri));
      switch (status.status) {
        case 'pending':
          delayedStatusPoll(dispatch, getState);
          break;
        case 'failure':
          dispatch(checkoutError(status.message));
          break;
        case 'success':
          window.location.assign(addQueryParamToURL(routes.recurringContribThankyou, 'INTCMP', state.common.intCmp));
          break;
        default:
          delayedStatusPoll(dispatch, getState);
      }
    });
  } else if (state.page.regularContrib.statusUri) {
    delayedStatusPoll(dispatch, getState);
  } else {
    dispatch(checkoutError('There was an error processing your payment. Please\u00a0try\u00a0again\u00a0later.'));
  }
}


export default function postCheckout(
  paymentFieldName: PaymentField,
  contributionType: Contrib): Function {
  return (token: string, dispatch: Function, getState: () => PageState) => {

    dispatch(resetPollCount());
    dispatch(creatingContributor());

    const request = requestData(paymentFieldName, token, contributionType, getState);

    return fetch(routes.recurringContribCreate, request).then((response) => {
      handleStatus(response, dispatch, getState);
    });
  };
}