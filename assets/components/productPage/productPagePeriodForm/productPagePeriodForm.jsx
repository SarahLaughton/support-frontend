// @flow

// ----- Imports ----- //

import React from 'react';

import SvgInfo from 'components/svgs/information';
import { outsetClassName, bgClassName } from 'components/productPage/productPageContentBlock/productPageContentBlock';

import ProductPageButton from '../productPageButton/productPageButton';
import ProductPagePeriodFormLabel from './productPagePeriodFormLabel';

// ---- Types ----- //

export type Period = {|
  title: string,
  copy: string,
  offer: string | null,
|}

export type StatePropTypes<P> = {|
  periods: {[P]: Period},
  selectedPeriod: P | null,
|};

export type DispatchPropTypes<P> = {|
  onSubmitAction: () => *,
  setPeriodAction: (P) => *,
|};

type PropTypes<P> = {|
  ...StatePropTypes<P>,
  ...DispatchPropTypes<P>,
|};


// ----- Render ----- //

export default function ProductPagePeriodForm<P:string>({
  periods, selectedPeriod, onSubmitAction, setPeriodAction,
}: PropTypes<P>) {

  const keys = Object.keys(periods);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onSubmitAction();
      }}
    >
      <div className={outsetClassName}>
        <div className="component-product-page-period-form__items">
          {keys.map((key: P) => {
            const {
              copy, title, offer,
            } = periods[key];
            return (
              <div className="component-product-page-period-form__item">
                <ProductPagePeriodFormLabel
                  title={title}
                  offer={offer}
                  type={key}
                  key={key}
                  checked={key === selectedPeriod}
                  onChange={() => { setPeriodAction(key); }}
                >
                  {copy}
                </ProductPagePeriodFormLabel>
              </div>
              );
            })}
        </div>
      </div>
      <div className={['component-product-page-period-form__cta', bgClassName].join(' ')} data-disabled={selectedPeriod === null}>
        <ProductPageButton disabled={selectedPeriod === null} type="submit">
          Subscribe now{selectedPeriod && periods[selectedPeriod] && ` – ${periods[selectedPeriod].title}`}
        </ProductPageButton>
      </div>

      <div className="component-product-page-period-form__info">
        <SvgInfo />
        You can cancel your subscription at any time
      </div>
    </form>
  );
}
