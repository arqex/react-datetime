import React from 'react'
import moment from 'moment'
import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withKnobs, text, select } from '@storybook/addon-knobs'
// import { withInfo } from '@storybook/addon-info'

import dateTimeReadMe from '../README.md'
import DateTime from '../DateTime'
import Wrapper from './wrapper'

storiesOf('Datetime', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(dateTimeReadMe))
  .add('main', () => (
    <Wrapper>
      <DateTime defaultValue={moment()} />
    </Wrapper>
  ))
  .add('Format change preview', () => (
    <Wrapper>
      <DateTime
        dateFormat={text('dateFormat', 'YYYY-MM-DD')}
        timeFormat={false}
        defaultValue={moment()}
      />
    </Wrapper>
  ))
  .add('View change preview', () => (
    <Wrapper>
      <DateTime
        viewMode={select(
          'viewMode',
          {
            years: 'Years',
            months: 'Months',
            days: 'Days',
            time: 'Time',
          },
          'days',
        )}
        input={false}
      />
    </Wrapper>
  ))
  //   .add('custom valid date function', () => (
  //     <DateTime
  //       viewMode={'months'}
  //       dateFormat={'MMMM'}
  //       isValidDate={current => current.isBefore(DateTime.moment().startOf('month'))}
  //     />
  //   ))
