// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { UserFormFieldAttribute } from 'helpers/user/userReducer';
import ErrorMessage from 'components/errorMessage/errorMessage';

import { userActions, type Action as UserAction } from 'helpers/user/userActions';
import TextInput from 'components/textInput/textInput';
import { formFieldError, showError, shouldShowError } from 'helpers/checkoutForm'
import type { Action as CheckoutFormAction } from './contributionsCheckoutContainer/checkoutFormActions';
import { checkoutFormActions } from './contributionsCheckoutContainer/checkoutFormActions';


// ----- Types ----- //

type PropTypes = {
  name: UserFormFieldAttribute,
};


// ----- Component ----- //

const NameFormField = (props: PropTypes) => {
  const showError = shouldShowError(props.name);
  const modifierClass = ['name'];
  if (showError) {
    modifierClass.push('error');
  }

  return (
    <div className="component-text-input__input--name__container">
      <TextInput
        id="name"
        placeholder="Full name"
        labelText="Full name"
        value={props.name.value}
        onChange={props.name.setValue}
        onBlur={props.name.setShouldValidate}
        modifierClasses={modifierClass}
        required
      />
      <ErrorMessage
        showError={showError}
        message="Please enter your name."
      />
    </div>
  );
};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  const nameFormField = {
    value: state.page.user.fullName,
    shouldValidate: state.page.checkoutForm.fullName.shouldValidate,
  };
  return {
    stateName: nameFormField,
  };

}

function mapDispatchToProps(dispatch: Dispatch<CheckoutFormAction | UserAction >) {
  return {
    setShouldValidate: () => {
      dispatch(checkoutFormActions().setFullNameShouldValidate());
    },
    setValue: (name: string) => {
      dispatch(userActions().setFullName(name));
    },

  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {

  const name: UserFormFieldAttribute = {
    ...stateProps.stateName,
    ...dispatchProps,
    isValid: formFieldError(stateProps.stateName.value, true)
  };

  return {
    name,
  }
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(NameFormField);
