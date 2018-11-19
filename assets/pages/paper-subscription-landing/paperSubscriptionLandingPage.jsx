// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';

import SvgInfo from 'components/svgs/information';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';
import ProductPageContentBlock from 'components/productPage/productPageContentBlock/productPageContentBlock';
import ProductPageTextBlock, { largeParagraphClassName, ulClassName, sansParagraphClassName } from 'components/productPage/productPageTextBlock/productPageTextBlock';

import Form from './components/form';
import reducer from './paperSubscriptionLandingPageReducer';

import './paperSubscriptionLandingPage.scss';


// ----- Collection or delivery ----- //

type Method = 'collection' | 'delivery';

const method: Method = window.location.pathname.includes('collection') ? 'collection' : 'delivery';

const reactElementId: {
  [Method]: string,
} = {
  collection: 'paper-subscription-landing-page-collection',
  delivery: 'paper-subscription-landing-page-delivery',
};


// ----- Redux Store ----- //

const store = pageInit(reducer, true);


// ----- Render ----- //

const content = (
  <Provider store={store}>
    <Page
      header={<SimpleHeader />}
      footer={<Footer />}
    >
      <ProductPagehero
        overheading="The Guardian paper subscriptions"
        heading="Save up to 31% on the Guardian and the Observer’s newspaper retail price all year round"
        type="feature"
        modifierClasses={['paper']}
      />
      <ProductPageContentBlock>
        <ProductPageTextBlock>
          <p className={largeParagraphClassName}>Pick between voucher and home delivery.
          If you live within London some more info about the two options at a glance There’s
           one for each newspaper in the package you choose.
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock>
        <ProductPageTextBlock title="How do vouchers work?">
          <ul className={ulClassName}>
            <li>When you take out a voucher subscription, we’ll send you a book of vouchers.
               There’s one for each newspaper in the package you choose. So if you choose a
               Sixday package, for example, you’ll receive six vouchers for each week,
               delivered every quarter.
            </li>
            <li>You can exchange these vouchers for that day’s newspaper at retailers
              across the UK. That includes most independent newsagents, a range of petrol
              stations, and most supermarkets, including Tesco, Sainsbury’s and
              Waitrose &amp; Partners.
            </li>
            <li>Your newsagent won’t lose out; we’ll pay them the same amount that
              they receive if you pay cash for your paper.
            </li>
            <li>You’ll receive your vouchers within 14 days of subscribing.</li>
            <li>You can pause your subscription for up to four weeks a year. So if
              you’re heading away, you won’t have to pay for the papers you’ll miss.
            </li>
          </ul>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature">
        <ProductPageTextBlock title="Subscribe to Guardian Paper today">
          <p>Now pick your perfect voucher subscription package</p>
        </ProductPageTextBlock>
        <Form />
      </ProductPageContentBlock>
      <ProductPageContentBlock type="feature" >
        <ProductPageTextBlock title="FAQ and help" icon={<SvgInfo />}>
          <p className={sansParagraphClassName}>Subscriptions available to people aged 18 and over with a valid email address. For full details of Guardian Paper print subscription services and their terms and conditions - see <a target="_blank" rel="noopener noreferrer" href="https://www.theguardian.com/guardian-weekly-subscription-terms-conditions">theguardian.com/guardian-weekly-subscription-terms-conditions</a>
          </p>
        </ProductPageTextBlock>
      </ProductPageContentBlock>
    </Page>
  </Provider>
);

renderPage(content, reactElementId[method]);

