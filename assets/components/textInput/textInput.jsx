// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  placeholder?: string,
  labelText?: string,
  id?: string,
  onChange?: (name: string) => void,
};


// ----- Functions ----- //

function inputClass(hasLabel: boolean): string {

  if (hasLabel) {
    return 'component-text-input__input';
  }

  return 'component-text-input';

}

function buildInput(labelText, id, placeholder, onChange) {

  const attrs: {
    className: string,
    id: ?string,
    type: string,
    placeholder: ?string,
    onChange?: Function,
  } = {
    className: inputClass(!!labelText),
    id,
    type: 'text',
    placeholder,
  };

  // Keeps flow happy (https://github.com/facebook/flow/issues/2819).
  if (typeof onChange === 'function') {
    const change = onChange;
    attrs.onChange = event => change(event.target.value || '');
  }

  return <input {...attrs} />;

}


// ----- Component ----- //

export default function TextInput(props: PropTypes) {

  const input = buildInput(
    props.labelText,
    props.id,
    props.placeholder,
    props.onChange,
  );

  if (!props.labelText) {
    return input;
  }

  return (
    <div className="component-text-input">
      <label htmlFor={props.id} className="component-text-input__label">
        {props.labelText}
      </label>
      {input}
    </div>
  );

}


// ----- Proptypes ----- //

TextInput.defaultProps = {
  placeholder: null,
  labelText: null,
  id: null,
  onChange: null,
};
