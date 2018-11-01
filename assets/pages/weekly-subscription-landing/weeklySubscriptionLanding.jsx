// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import HeadingBlock from 'components/headingBlock/headingBlock';

import { detect, type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { statelessInit as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';


// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'weekly-landing-page-uk',
  UnitedStates: 'weekly-landing-page-us',
  AUDCountries: 'weekly-landing-page-au',
  NZDCountries: 'weekly-landing-page-nz',
  EURCountries: 'weekly-landing-page-eu',
  Canada: 'weekly-landing-page-ca',
  International: 'weekly-landing-page-int',
};

// ----- Page Startup ----- //

pageInit();


// ----- Render ----- //

const content = (
  <Page
    header={<SimpleHeader />}
    footer={<Footer />}
  >
    <HeadingBlock overheading="The Guardian Weekly subscriptions" heading="Seven days of international news, analysis and features in one magazine, curated to give you a clearer global perspective." />
  </Page>
);

renderPage(content, reactElementId[countryGroupId]);
