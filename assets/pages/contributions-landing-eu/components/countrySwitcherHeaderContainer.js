// @flow

// ----- Imports ----- //

import { connect } from 'react-redux';

import CountrySwitcherHeader from 'components/headers/countrySwitcherHeader/countrySwitcherHeader';

import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { State } from '../contributionsLandingEUReducer';


const availableCountriesGroups: CountryGroupId[] =
  ['GBPCountries', 'UnitedStates', 'EURCountries'];

// ----- Functions ----- //

function handleCountryGroupChange(value: string): void {
  switch (value) {
    case 'UnitedStates':
      window.location.pathname = '/us/contribute';
      break;
    case 'AUDCountries':
      window.location.pathname = '/au';
      break;
    case 'GBPCountries':
      window.location.pathname = '/uk/contribute';
      break;
    default:
  }
}


// ----- State Maps ----- //

function mapStateToProps(state: State) {

  return {
    countryGroupIds: availableCountriesGroups,
    selectedCountryGroup: state.common.countryGroup,
    onCountryGroupSelect: handleCountryGroupChange,
  };
}


// ----- Exports ----- //

export default connect(mapStateToProps)(CountrySwitcherHeader);