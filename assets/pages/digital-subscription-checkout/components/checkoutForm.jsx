// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { countries, usStates, caStates, type IsoCountry } from 'helpers/internationalisation/country';
import { type FormError, firstError } from 'helpers/subscriptionsForms/validation';
import { type Option } from 'helpers/types/option';

import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';
import { Input } from 'components/forms/standardFields/input';
import { Select } from 'components/forms/standardFields/select';
import { Fieldset } from 'components/forms/standardFields/fieldset';
import { sortedOptions } from 'components/forms/customFields/sortedOptions';
import { RadioInput } from 'components/forms/customFields/radioInput';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { withError } from 'components/forms/formHOCs/withError';
import { asControlled } from 'components/forms/formHOCs/asControlled';
import { canShow } from 'components/forms/formHOCs/canShow';

import {
  type State,
  type FormFields,
  type FormField,
  type FormActionCreators,
  getFormFields,
  formActionCreators,
} from '../digitalSubscriptionCheckoutReducer';


// ----- Types ----- //

type PropTypes = {|
  ...FormFields,
  errors: FormError<FormField>[],
  ...FormActionCreators,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state: State) {
  return {
    ...getFormFields(state),
    errors: state.page.checkout.errors,
  };
}


// ----- Form Fields ----- //

const Input1 = compose(asControlled, withError, withLabel)(Input);
const Select1 = compose(asControlled, withError, withLabel)(Select);
const Select2 = canShow(Select1);

function statesForCountry(country: Option<IsoCountry>): React$Node {

  switch (country) {
    case 'US':
      return sortedOptions(usStates);
    case 'CA':
      return sortedOptions(caStates);
    default:
      return null;
  }

}


// ----- Component ----- //

function CheckoutForm(props: PropTypes) {

  return (
    <div className="checkout-form">
      <LeftMarginSection modifierClasses={['your-details']}>
        <h2 className="checkout-form__heading">Your details</h2>
        <Input1
          id="first-name"
          label="First name"
          type="text"
          value={props.firstName}
          setValue={props.setFirstName}
          error={firstError('firstName', props.errors)}
        />
        <Input1
          id="last-name"
          label="Last name"
          type="text"
          value={props.lastName}
          setValue={props.setLastName}
          error={firstError('lastName', props.errors)}
        />
        <Select1
          id="country"
          label="Country"
          value={props.country}
          setValue={props.setCountry}
          error={firstError('country', props.errors)}
        >
          <option value="">--</option>
          {sortedOptions(countries)}
        </Select1>
        <Select2
          id="stateProvince"
          label={props.country === 'CA' ? 'Province/Territory' : 'State'}
          value={props.stateProvince}
          setValue={props.setStateProvince}
          error={firstError('stateProvince', props.errors)}
          isShown={props.country === 'US' || props.country === 'CA'}
        >
          <option value="">--</option>
          {statesForCountry(props.country)}
        </Select2>
        <Input1
          id="telephone"
          label="Telephone (optional)"
          type="tel"
          value={props.telephone}
          setValue={props.setTelephone}
          error={firstError('telephone', props.errors)}
        />
      </LeftMarginSection>
      <LeftMarginSection>
        <h2 className="checkout-form__heading">How often would you like to pay?</h2>
        <Fieldset>
          <RadioInput
            text="£11.99 Every month"
            name="paymentFrequency"
            checked={props.paymentFrequency === 'monthly'}
            onChange={() => props.setPaymentFrequency('monthly')}
          />
          <RadioInput
            text="£119.90 Every year"
            name="paymentFrequency"
            checked={props.paymentFrequency === 'yearly'}
            onChange={() => props.setPaymentFrequency('yearly')}
          />
        </Fieldset>
      </LeftMarginSection>
      <LeftMarginSection>
        <h2 className="checkout-form__heading">How would you like to pay?</h2>
        <Fieldset>
          <RadioInput
            text="Direct debit"
            name="paymentMethod"
            checked={props.paymentMethod === 'directDebit'}
            onChange={() => props.setPaymentMethod('directDebit')}
          />
          <RadioInput
            text="Credit/Debit card"
            name="paymentMethod"
            checked={props.paymentMethod === 'card'}
            onChange={() => props.setPaymentMethod('card')}
          />
        </Fieldset>
        <button onClick={() => props.submitForm()}>Submit</button>
      </LeftMarginSection>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps, formActionCreators)(CheckoutForm);
