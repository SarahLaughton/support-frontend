// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import { amounts, getFrequency, type Contrib } from 'helpers/contributions';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { detect, countryGroups, type CountryGroupId, type CountryGroup } from 'helpers/internationalisation/countryGroup';
import { currencies } from 'helpers/internationalisation/currency';

import Page from 'components/page/page';
import Footer from 'components/footer/footer';

import { createPageReducerFor } from './contributionsLandingReducer';


// ----- Redux Store ----- //

const countryGroupId: CountryGroupId = detect();

const store = pageInit(createPageReducerFor(countryGroupId));

const reactElementId = `new-contributions-landing-page-${countryGroups[countryGroupId].supportInternationalisationId}`;

// ----- Internationalisation ----- //

const defaultHeaderCopy = 'Help us deliver the independent journalism the world needs';
const defaultContributeCopy = `
  Make a monthly commitment to support The Guardian long term or a one-off contribution 
  as and when you feel like it – choose the option that suits you best.
`;

type CountryMetaData = {
  headerCopy: string,
  contributeCopy: string,
  currency: Object,
  contribution: Object
};

const countryGroupSpecificDetails: {
  [CountryGroupId]: CountryMetaData
} = {
  GBPCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'British Pounds',
      symbol: '£',
    },
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  EURCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'Euros',
      symbol: '€',
    },
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  UnitedStates: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'US Dollars',
      symbol: '$',
    },
    contribution: {
      oneoff: 'One-time',
      monthly: 'Monthly',
    },
  },
  AUDCountries: {
    headerCopy: 'Help us deliver the independent journalism Australia needs',
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'Australian Dollars',
      symbol: '$',
    },
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  International: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'Canadian Dollars',
      symbol: '$',
    },
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  NZDCountries: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'Canadian Dollars',
      symbol: '$',
    },
    contribution: {
      oneoff: 'One-off',
      monthly: 'Monthly',
    },
  },
  Canada: {
    headerCopy: defaultHeaderCopy,
    contributeCopy: defaultContributeCopy,
    currency: {
      name: 'Canadian Dollars',
      symbol: '$',
    },
    contribution: {
      oneoff: 'One-time',
      monthly: 'Monthly',
    },
  },
};

type Amount = { value: string, spoken: string };

const contributionType: Contrib = 'MONTHLY';

const selectedCountryGroupDetails = countryGroupSpecificDetails[countryGroupId];

const formatAmount = (amount: Amount, verbose: boolean) => (verbose ?
  `${amount.value} ${selectedCountryGroupDetails.currency.name}` :
  `${selectedCountryGroupDetails.currency.symbol}${amount.value}`);

const selectedCountryGroup = countryGroups[countryGroupId];

const selectedAmounts = amounts('notintest')[contributionType][countryGroupId];

// ----- Render ----- //

const renderAmount = (amount: Amount, i) => (
  <li className="form__radio-group__item">
    <input
      id={`contributionAmount-${amount.value}`}
      className="form__radio-group__input"
      type="radio"
      name="contributionAmount"
      value={amount.value}
      checked={i === 0}
    />
    <label htmlFor={`contributionAmount-${amount.value}`} className="form__radio-group__label" aria-label={formatAmount(amount, true)}>
      {formatAmount(amount, false)}
    </label>
  </li>
);

const renderCountryGroup = (countryGroup: CountryGroup) => (
  <li className="countryGroups__item">
    <a href={`/${countryGroup.supportInternationalisationId}/contribute.react`}>
      {countryGroup === selectedCountryGroup ? (
        <span className="icon">
          <svg width="18" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M1.36 6.9l-.86.888L4.798 14h.409L17.5.865 16.64 0 5.207 10.694z" /></svg>
        </span>
      ) : ''}
      {countryGroup.name} ({currencies[countryGroup.currency].extendedGlyph})
    </a>
  </li>
);

const content = (
  <Provider store={store}>
    <Page
      header={
        <header role="banner" className="gu-content__header">
          <a className="glogo" href="https://www.theguardian.com"><img src="/assets-payment/roundel.svg" alt="The Guardian" /></a>
          <details className="countryGroups">
            <summary aria-label={`Selected country: ${selectedCountryGroup.name} (${currencies[selectedCountryGroup.currency].glyph})`}>
              <svg className="icon icon--world" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M3.429 3.143H6.57V0a6.46 6.46 0 0 0-2.133.46 5.43 5.43 0 0 0-.54 1.076c-.2.516-.356 1.062-.47 1.607M3.336 1.376c.03-.078.062-.155.093-.233a7.155 7.155 0 0 0-2.286 2.286h1.606c.139-.7.34-1.384.587-2.053M2.356 7.429H0C.046 8.325.277 9.192.678 10H2.57c-.138-.852-.2-1.72-.215-2.571M2.571 4H.678A6.528 6.528 0 0 0 0 6.571h2.356c.015-.867.092-1.719.215-2.571M11.465 3.143h1.392a7.05 7.05 0 0 0-2-2c.015.029.03.072.045.1.237.62.43 1.252.563 1.9M11.931 6.571H14A6.861 6.861 0 0 0 13.363 4h-1.649c.13.852.203 1.704.217 2.571M10.571 3.129c-.113-.546-.27-1.091-.469-1.608A5.618 5.618 0 0 0 9.604.502 6.767 6.767 0 0 0 7.43 0v3.143h3.142v-.014zM7.429 10h3.487c.136-.852.212-1.704.227-2.571H7.429V10zM11.714 10h1.65A6.861 6.861 0 0 0 14 7.429h-2.069A19.27 19.27 0 0 1 11.714 10M10.571 10.857H7.43V14a6.682 6.682 0 0 0 2.175-.502c.2-.316.37-.66.498-1.02.2-.53.356-1.061.47-1.62M3.429 10.857c.113.54.27 1.08.469 1.607.142.384.327.74.54 1.08.683.271 1.408.413 2.133.456v-3.129l-3.142-.014zM6.857 4H3.368a18.36 18.36 0 0 0-.225 2.571h3.714V4zM10.902 12.756c-.015.044-.03.072-.045.101a7.05 7.05 0 0 0 2-2h-1.392c-.134.648-.326 1.28-.563 1.9M11.143 6.571c-.015-.867-.09-1.719-.227-2.571H7.43v2.571h3.714zM2.749 10.857H1.143a7.314 7.314 0 0 0 2.286 2.286c-.031-.078-.078-.156-.093-.233a13.525 13.525 0 0 1-.587-2.053M3.143 7.429c.015.867.09 1.719.226 2.571h3.488V7.429H3.143z" /></svg>
              <span className="countryGroups__label">{selectedCountryGroup.name} ({currencies[selectedCountryGroup.currency].extendedGlyph})</span>
              <span className="icon icon--arrows">
                <svg width="19" height="10" xmlns="http://www.w3.org/2000/svg"><path className="icon__arrow-down" d="M1.25.5l-.75.75L9 9.5h.95l8.55-8.25-.75-.75L9.5 7.25z" /><path className="icon__arrow-up" d="M1.25 9.5L.5 8.75 9 .5h.95l8.55 8.25-.75.75L9.5 2.75z" /></svg>
              </span>
            </summary>
            <ul className="countryGroups__list">
              {(Object.values(countryGroups): any).map(renderCountryGroup)}
            </ul>
          </details>
        </header>
      }
      footer={<Footer disclaimer countryGroupId={countryGroupId} />}
    >
      <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
      <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
      <form action="#" method="post" className="form form--contribution">
        <fieldset className="form__radio-group form__radio-group--tabs form__radio-group--contribution-type">
          <legend className="form__legend form__legend--radio-group">Recurrence</legend>
          <ul className="form__radio-group__list">
            <li className="form__radio-group__item">
              <input
                id="contributionType-monthly"
                className="form__radio-group__input"
                type="radio"
                name="contributionType"
                value="monthly"
                checked={contributionType === 'MONTHLY'}
              />
              <label htmlFor="contributionType-monthly" className="form__radio-group__label">{selectedCountryGroupDetails.contribution.monthly}</label>
            </li>
            <li className="form__radio-group__item">
              <input
                id="contributionType-oneoff"
                className="form__radio-group__input"
                type="radio"
                name="contributionType"
                value="oneoff"
                checked={contributionType === 'ONE_OFF'}
              />
              <label htmlFor="contributionType-oneoff" className="form__radio-group__label">{selectedCountryGroupDetails.contribution.oneoff}</label>
            </li>
          </ul>
        </fieldset>

        <fieldset className="form__radio-group form__radio-group--pills form__radio-group--contribution-amount">
          <legend className="form__legend form__legend--radio-group">Amount</legend>
          <ul className="form__radio-group__list">
            {selectedAmounts.map(renderAmount)}
            <li className="form__radio-group__item">
              <input id="contributionAmount-other" className="form__radio-group__input" type="radio" name="contributionAmount" value="other" />
              <label htmlFor="contributionAmount-other" className="form__radio-group__label">Other</label>
            </li>
          </ul>
          <div className="form__field form__field--contribution-other-amount">
            <label className="form__label" htmlFor="contributionOther">Other Amount</label>
            <span className="form__input-with-icon">
              <input id="contributionOther" className="form__input" type="number" min="1" max="2000" autoComplete="off" />
              <span className="form__icon">
                <svg width="11" height="19" xmlns="http://www.w3.org/2000/svg"><path d="M2.9 18.992l.365-2.676c-1.176-.08-2.292-.304-3.062-.648L0 12.06h1.724l.77 2.676c.284.141.629.243.994.304l.588-4.48-.629-.263C1.297 9.405.122 8.047.122 5.919c0-2.412 1.44-4.297 5.07-4.358L5.393 0h1.359l-.224 1.601a10.19 10.19 0 0 1 2.657.548l.203 3.445H7.766l-.73-2.493a2.784 2.784 0 0 0-.77-.203l-.527 4.075.608.243c2.291.932 3.873 1.925 3.873 4.5 0 2.979-2.109 4.661-5.637 4.661l-.345 2.615H2.9zm.243-14.31c0 .912.406 1.378 1.46 1.845l.487-3.69c-1.278.082-1.947.77-1.947 1.845zm3.812 8.412c0-1.095-.547-1.54-1.764-2.047L4.664 15.1c1.52-.101 2.291-.85 2.291-2.006z" /><path d="M-14-12h38v42h-38z" fill="none" /></svg>
              </span>
            </span>
          </div>
        </fieldset>

        <div className="form__field form__field--contribution-fname">
          <label className="form__label" htmlFor="contributionFirstName">First Name</label>
          <span className="form__input-with-icon">
            <input id="contributionFirstName" className="form__input" type="text" autoCapitalize="words" required />
            <span className="form__icon">
              <svg width="14" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M6.99 7.381c1.433 0 3.121-1.66 3.121-3.683C10.111 1.674 8.953.5 6.991.5 5.026.5 3.888 1.674 3.888 3.698c0 2.023 1.825 3.683 3.101 3.683zM2.333 9.789l-.797.83L0 16.69l.758.81h12.445l.797-.81-1.556-6.071-.777-.83C10.11 9.283 8.692 9 7 9c-1.711 0-3.111.243-4.667.79z" fillRule="evenodd" /></svg>
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-lname">
          <label className="form__label" htmlFor="contributionLastName">Last Name</label>
          <span className="form__input-with-icon">
            <input id="contributionLastName" className="form__input" aria-describedby="error-contributionLastName" autoCapitalize="words" type="text" required />
            <span className="form__icon">
              <svg width="14" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M6.99 7.381c1.433 0 3.121-1.66 3.121-3.683C10.111 1.674 8.953.5 6.991.5 5.026.5 3.888 1.674 3.888 3.698c0 2.023 1.825 3.683 3.101 3.683zM2.333 9.789l-.797.83L0 16.69l.758.81h12.445l.797-.81-1.556-6.071-.777-.83C10.11 9.283 8.692 9 7 9c-1.711 0-3.111.243-4.667.79z" /></svg>
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-email">
          <label className="form__label" htmlFor="contributionEmail">Email address</label>
          <span className="form__input-with-icon">
            <input id="contributionEmail" className="form__input" type="email" placeholder="example@domain.com" required />
            <span className="form__icon">
              <svg width="16" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M.902 0L8 6.213 15.098 0H.902zM0 .787v8.42l4.787-4.232L0 .787zm16 0l-4.787 4.188L16 9.206V.787zM5.689 5.763L.896 10h14.208L10.31 5.763 8.378 7.456a.575.575 0 0 1-.756 0L5.689 5.763z" /></svg>
            </span>
          </span>
        </div>
        <div className="form__field form__field--contribution-state">
          <label className="form__label" htmlFor="contributionState">State</label>
          <span className="form__input-with-icon">
            <select id="contributionState" className="form__input" placeholder="State" required>
              <option />
              <option value="al">AL (Alabama)</option>
              <option value="wy">WY (Wyoming)</option>
            </select>
            <span className="form__icon">
              <svg className="icon icon--world" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M3.429 3.143H6.57V0a6.46 6.46 0 0 0-2.133.46 5.43 5.43 0 0 0-.54 1.076c-.2.516-.356 1.062-.47 1.607M3.336 1.376c.03-.078.062-.155.093-.233a7.155 7.155 0 0 0-2.286 2.286h1.606c.139-.7.34-1.384.587-2.053M2.356 7.429H0C.046 8.325.277 9.192.678 10H2.57c-.138-.852-.2-1.72-.215-2.571M2.571 4H.678A6.528 6.528 0 0 0 0 6.571h2.356c.015-.867.092-1.719.215-2.571M11.465 3.143h1.392a7.05 7.05 0 0 0-2-2c.015.029.03.072.045.1.237.62.43 1.252.563 1.9M11.931 6.571H14A6.861 6.861 0 0 0 13.363 4h-1.649c.13.852.203 1.704.217 2.571M10.571 3.129c-.113-.546-.27-1.091-.469-1.608A5.618 5.618 0 0 0 9.604.502 6.767 6.767 0 0 0 7.43 0v3.143h3.142v-.014zM7.429 10h3.487c.136-.852.212-1.704.227-2.571H7.429V10zM11.714 10h1.65A6.861 6.861 0 0 0 14 7.429h-2.069A19.27 19.27 0 0 1 11.714 10M10.571 10.857H7.43V14a6.682 6.682 0 0 0 2.175-.502c.2-.316.37-.66.498-1.02.2-.53.356-1.061.47-1.62M3.429 10.857c.113.54.27 1.08.469 1.607.142.384.327.74.54 1.08.683.271 1.408.413 2.133.456v-3.129l-3.142-.014zM6.857 4H3.368a18.36 18.36 0 0 0-.225 2.571h3.714V4zM10.902 12.756c-.015.044-.03.072-.045.101a7.05 7.05 0 0 0 2-2h-1.392c-.134.648-.326 1.28-.563 1.9M11.143 6.571c-.015-.867-.09-1.719-.227-2.571H7.43v2.571h3.714zM2.749 10.857H1.143a7.314 7.314 0 0 0 2.286 2.286c-.031-.078-.078-.156-.093-.233a13.525 13.525 0 0 1-.587-2.053M3.143 7.429c.015.867.09 1.719.226 2.571h3.488V7.429H3.143z" /></svg>
            </span>
          </span>
        </div>
        <fieldset className="form__radio-group form__radio-group--buttons form__radio-group--contribution-pay">
          <legend className="form__legend form__legend--radio-group">Pay with</legend>

          <ul className="form__radio-group__list">
            <li className="form__radio-group__item">
              <input id="contributionPayment-paypal" className="form__radio-group__input" name="contributionPayment" type="radio" value="paypal" checked />
              <label htmlFor="contributionPayment-paypal" className="form__radio-group__label">
                <span className="radio-ui" />
                <span className="radio-ui__label">PayPal</span>
                <img className="radio-ui__icon radio-ui__icon--paypal" src="/assets-payment/paypal.png" alt="" />
              </label>
            </li>
            <li className="form__radio-group__item">
              <input id="contributionPayment-card" className="form__radio-group__input" name="contributionPayment" type="radio" value="card" />
              <label htmlFor="contributionPayment-card" className="form__radio-group__label">
                <span className="radio-ui" />
                <span className="radio-ui__label">Credit/Debit Card</span>
                <img className="radio-ui__icon radio-ui__icon--card" src="/assets-payment/card.svg" alt="" />
              </label>
            </li>
          </ul>
        </fieldset>
        <div className="form__submit">
          <button className="form__submit__button" type="submit">
            Contribute&nbsp;
            {formatAmount(selectedAmounts[0], false)}&nbsp;
            {getFrequency(contributionType)}
          </button>
        </div>
      </form>
    </Page>
  </Provider>
);

renderPage(content, reactElementId);
