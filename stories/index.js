import React from 'react'

import { storiesOf } from '@storybook/react'
import withReadme from 'storybook-readme/with-readme'
import { withInfo } from '@storybook/addon-info'

import dateTimeReadMe from '../README.md'
import DateTime from '../DateTime'

storiesOf('Datetime', module)
  .addDecorator(withReadme(dateTimeReadMe))
  .add('main', withInfo('Main Component Preview')(() => (
    <DateTime
      viewMode={'months'}
      dateFormat={'MMMM'}
      isValidDate={current => current.isBefore(DateTime.moment().startOf('month'))}
    />
  )))
