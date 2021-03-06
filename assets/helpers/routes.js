// @flow

// ----- Routes ----- //

import type { CountryGroupId } from './internationalisation/countryGroup';
import { countryGroups } from './internationalisation/countryGroup';
import { getOrigin } from './url';

const routes: {
  [string]: string,
} = {
  recurringContribCheckout: '/contribute/recurring',
  recurringContribCheckoutGuest: '/contribute/recurring-guest',
  recurringContribThankyou: '/contribute/recurring/thankyou',
  recurringContribCreate: '/contribute/recurring/create',
  recurringContribPending: '/contribute/recurring/pending',
  contributionsSendMarketing: '/contribute/send-marketing',
  contributionsSetPasswordGuest: '/identity/set-password-guest',
  getUserType: '/identity/get-user-type',
  oneOffContribCheckout: '/contribute/one-off',
  oneOffContribThankyou: '/contribute/one-off/thankyou',
  oneOffContribAutofill: '/contribute/one-off/autofill',
  contributionsMarketingConfirm: '/contribute/marketing-confirm',
  payPalSetupPayment: '/paypal/setup-payment',
  payPalCreateAgreement: '/paypal/create-agreement',
  directDebitCheckAccount: '/direct-debit/check-account',
  payPalRestReturnURL: '/paypal/rest/return',
  digitalSubscriptionCreate: '/subscribe/digital/create',
  showcase: '/showcase',
  subscriptionsLanding: '/subscribe',
  digitalSubscriptionLanding: '/subscribe/digital',
  paperSubscriptionLanding: '/subscribe/paper',
  guardianWeeklySubscriptionLanding: '/subscribe/weekly',
};

function paperSubsUrl(withDelivery: boolean = false): string {
  return [getOrigin(), 'uk/subscribe/paper', ...(withDelivery ? ['delivery'] : [])].join('/');
}

function payPalCancelUrl(cgId: CountryGroupId): string {
  return `${getOrigin()}/${countryGroups[cgId].supportInternationalisationId}/contribute`;
}

// TODO: cleanup
function payPalReturnUrl(cgId: CountryGroupId): string {
  return `${getOrigin()}/${countryGroups[cgId].supportInternationalisationId}/paypal/rest/return`;
}

// ----- Exports ----- //

export { routes, payPalCancelUrl, payPalReturnUrl, paperSubsUrl };
