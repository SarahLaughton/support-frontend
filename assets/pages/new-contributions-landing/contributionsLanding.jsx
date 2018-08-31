// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { amounts, type Contrib } from 'helpers/contributions';
import { type PaymentMethod } from 'helpers/checkouts';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { classNameWithModifiers } from 'helpers/utilities';
import { detect, countryGroups, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroupSpecificDetails } from 'helpers/internationalisation/contributions';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';

import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';

import { NewHeader } from 'components/headers/new-header/Header';
import { NewContributionType } from './components/ContributionType';
import { NewContributionAmount } from './components/ContributionAmount';
import { NewContributionPayment } from './components/ContributionPayment';
import { NewContributionState } from './components/ContributionState';
import { NewContributionSubmit } from './components/ContributionSubmit';
import { NewContributionTextInput } from './components/ContributionTextInput';

import { createPageReducerFor } from './contributionsLandingReducer';

// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const contributionType: Contrib = 'MONTHLY';
const paymentMethod: PaymentMethod = 'PayPal';
const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];
const selectedCountryGroup = countryGroups[countryGroupId];
const selectedAmounts = amounts('notintest')[contributionType][countryGroupId];

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<NewHeader selectedCountryGroup={selectedCountryGroup} />}
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
      <form action="#" method="post" className={classNameWithModifiers('form', ['contribution'])}>
        <NewContributionType />
        <NewContributionAmount countryGroupDetails={selectedCountryGroupDetails} />
        <NewContributionTextInput id="contributionFirstName" name="contribution-fname" label="First Name" icon={<SvgUser />} required />
        <NewContributionTextInput id="contributionLastName" name="contribution-lname" label="Last Name" icon={<SvgUser />} required />
        <NewContributionTextInput id="contributionEmail" name="contribution-email" label="Email address" type="email" placeholder="example@domain.com" icon={<SvgEnvelope />} required />
        <NewContributionState countryGroupId={countryGroupId} />
        <NewContributionPayment />
        <NewContributionSubmit
          countryGroupId={countryGroupId}
          selectedAmounts={selectedAmounts}
          contributionType={contributionType}
          paymentMethod={paymentMethod}
        />
      </form>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
