// @flow

// ----- Imports  ----- //

import React from 'react';

import { type HeadingSize } from 'components/heading/heading';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { type ImageId } from 'helpers/theGrid';


// ----- Component ----- //

function DigitalPack(props: {
  headingSize: HeadingSize,
  url: string,
  subheading: string,
  copy: string,
  gridId: ImageId,
}) {

  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital Pack"
      subheading={props.subheading}
      headingSize={props.headingSize}
      benefits={{
        list: false,
        copy: props.copy,
      }}
      gridImage={{
        gridId: props.gridId,
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
          modifierClasses: ['border'],
        },
      ]}
    />
  );

}


// ----- Exports ----- //

export default DigitalPack;