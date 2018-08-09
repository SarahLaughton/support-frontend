// @flow

// ----- Imports ----- //

import React from 'react';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/introduction/circlesIntroduction';
import QuestionsContact from 'components/questionsContact/questionsContact';
import SpreadTheWord from 'components/spreadTheWord/spreadTheWord';
import MarketingConsent from 'components/marketingConsent/marketingConsent';
import { type Contrib } from 'helpers/contributions';

import EmailConfirmation from './emailConfirmation';
import DirectDebitDetails, { type PropTypes as DirectDebit } from './directDebitDetails';


// ---- Types ----- //

type PropTypes = {
  contributionType: Contrib,
  directDebit: ?DirectDebit,
};


// ----- Component ----- //

export default function ContributionsThankYouPage(props: PropTypes) {
  return (
    <Page
      id="contributions-thank-you-page"
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <CirclesIntroduction
        headings={['Thank you', 'for a valuable', 'contribution']}
        modifierClasses={['compact']}
      />
      <div className="multiline-divider" />
      <BodyCopy {...props} />
      <MarketingConsent
        context="CONTRIBUTIONS_THANK_YOU"
        checkboxLabelTitle="Subscriptions, membership and supporting The&nbsp;Guardian"
        checkboxLabelCopy="Get related news and offers - whether you are a subscriber, member, supporter or would like to become one."
      />
      <QuestionsContact />
      <SpreadTheWord />
    </Page>
  );
}


// ----- Auxiliary Components ----- //

function BodyCopy(props: PropTypes) {
  if (props.contributionType === 'ONE_OFF') {
    return null;
  } else if (props.directDebit) {
    return <DirectDebitDetails {...props.directDebit} />;
  }
  return <EmailConfirmation />;
}
