// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';
import SvgCheckmark from 'components/svgs/checkmark';

import uuidv4 from 'uuid';

import { type WeeklyBillingPeriod } from 'helpers/subscriptions';

// ---- Types ----- //

type PropTypes = {|
  type: WeeklyBillingPeriod,
  title: string,
  offer: string | null,
  children: Node,
  checked: boolean,
  onChange: (Event) => void,
|};


// ----- Render ----- //

export default ({
  type, title, offer, children, checked, onChange,
}: PropTypes) => {
  const id = uuidv4();
  return (
    <label onChange={onChange} htmlFor={id} className="weekly-form-label-wrap">
      <input checked={checked} className="weekly-form-label-wrap__input" id={id} type="radio" name="sub-type" value={type} />
      <div className="weekly-form-label">
        <div className="weekly-form-label__title">
          {title}
          <div aria-hidden="true" className="weekly-form-label__check"><SvgCheckmark /></div>
        </div>
        <div className="weekly-form-label__copy">
          {offer && <div className="weekly-form-label__offer">{offer}</div>}
          {children}
        </div>
      </div>
    </label>
  );
};
