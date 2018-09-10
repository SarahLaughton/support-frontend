// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { setGnmMarketing, type Action } from 'helpers/user/userActions';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import MarketingConsent from 'components/marketingConsent/marketingConsent';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { type State } from '../oneOffContributionsReducer';


// ----- State/Action Maps ----- //

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    onClick: (marketingPreferencesOptIn: boolean, email: string, csrf: CsrfState) => {
      sendMarketingPreferencesToIdentity(
        marketingPreferencesOptIn,
        email,
        dispatch,
        csrf,
        'CONTRIBUTIONS_THANK_YOU',
      );
    },
    marketingPreferenceUpdate: (preference: boolean) => {
      dispatch(setGnmMarketing(preference));
    },
  };
}

function mapStateToProps(state: State) {
  return {
    email: state.page.user.email,
    marketingPreferencesOptIn: state.page.user.gnmMarketing,
    consentApiError: state.page.marketingConsent.error,
    confirmOptIn: state.page.marketingConsent.confirmOptIn,
    csrf: state.page.csrf,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
