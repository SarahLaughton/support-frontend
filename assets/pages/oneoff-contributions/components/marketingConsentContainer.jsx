// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { setGnmMarketing, type Action } from 'helpers/user/userActions';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import MarketingConsent from 'components/marketingConsent/marketingConsent';

import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { PageState as OneOffPageState } from '../oneOffContributionsReducer';

// ----- Component ----- //

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

function mapStateToProps(state: OneOffPageState) {
  return {
    email: state.page.user.email.value,
    marketingPreferencesOptIn: state.page.user.gnmMarketing,
    consentApiError: state.page.marketingConsent.error,
    confirmOptIn: state.page.marketingConsent.confirmOptIn,
    csrf: state.page.csrf,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
