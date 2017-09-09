import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import withReadme from 'storybook-readme/with-readme'
import { withInfo } from '@storybook/addon-info'

import { Button, Welcome } from '@storybook/react/demo'

import dateTimeReadMe from '../README.md'

storiesOf('Datetime', module)
  .addDecorator(withReadme(dateTimeReadMe))
  .add('main', withInfo('Main Component Preview')(() => <div>Here there lies Datepicker</div>))
