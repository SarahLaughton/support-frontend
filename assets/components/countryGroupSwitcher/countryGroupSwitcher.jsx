// @flow

// ----- Imports ----- //

import React from 'react';

import { countryGroups } from 'helpers/internationalisation/countryGroup';
import SelectInput from 'components/selectInput/selectInput';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { SelectOption } from 'components/selectInput/selectInput';

// ----- Props ----- //


type PropTypes = {
  countryGroupIds: CountryGroupId[],
  selectedCountryGroup: CountryGroupId,
  onCountryGroupSelect: Function,
};


// ----- Component ----- //

function CountryGroupSwitcher(props: PropTypes) {

  const options: SelectOption[] =
    props.countryGroupIds.map((countryGroupId: CountryGroupId) =>
      ({
        value: countryGroupId,
        text: countryGroups[countryGroupId].name,
        selected: countryGroupId === props.selectedCountryGroup,
      }));

  return <SelectInput id="qa-country-group-dropdown" onChange={props.onCountryGroupSelect} options={options} />;
}


// ----- Exports ----- //

export default CountryGroupSwitcher;
