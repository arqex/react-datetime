# react-datetime

[![CircleCI](https://circleci.com/gh/NateRadebaugh/react-datetime.svg?style=svg)](https://circleci.com/gh/NateRadebaugh/react-datetime)
[![Build Status](https://secure.travis-ci.org/NateRadebaugh/react-datetime.svg)](https://travis-ci.org/NateRadebaugh/react-datetime)
[![npm version](https://badge.fury.io/js/%40nateradebaugh%2Freact-datetime.svg)](https://badge.fury.io/js/%40nateradebaugh%2Freact-datetime)

[![codecov](https://codecov.io/gh/NateRadebaugh/react-datetime/branch/master/graph/badge.svg)](https://codecov.io/gh/NateRadebaugh/react-datetime)
[![Coverage Status](https://coveralls.io/repos/github/NateRadebaugh/react-datetime/badge.svg?branch=master)](https://coveralls.io/github/NateRadebaugh/react-datetime?branch=master)
[![BCH compliance](https://bettercodehub.com/edge/badge/NateRadebaugh/react-datetime)](https://bettercodehub.com/results/NateRadebaugh/react-datetime)
[![CodeFactor](https://www.codefactor.io/repository/github/NateRadebaugh/react-datetime/badge)](https://www.codefactor.io/repository/github/NateRadebaugh/react-datetime)

[![install size](https://packagephobia.now.sh/badge?p=@nateradebaugh/react-datetime)](https://packagephobia.now.sh/result?p=@nateradebaugh/react-datetime)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@nateradebaugh/react-datetime.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@nateradebaugh/react-datetime.svg)

[![Known Vulnerabilities](https://snyk.io/test/github/NateRadebaugh/react-datetime/badge.svg)](https://snyk.io/test/github/NateRadebaugh/react-datetime)
![David](https://img.shields.io/david/nateradebaugh/react-datetime.svg)
![David](https://img.shields.io/david/dev/nateradebaugh/react-datetime.svg)
![David](https://img.shields.io/david/peer/nateradebaugh/react-datetime.svg)
![David](https://img.shields.io/david/optional/nateradebaugh/react-datetime.svg)

A date and time picker in the same React.js component. It can be used as a datepicker, timepicker or both at the same time. It is **highly customizable**.

This project started as a fork of https://github.com/YouCanBookMe/react-datetime which itself was a fork of https://github.com/quri/react-bootstrap-datetimepicker but the code and the API has changed a lot.

## Installation

Install using npm:

```sh
npm install --save @nateradebaugh/react-datetime
```

Install using yarn:

```sh
yarn add @nateradebaugh/react-datetime
```

## Usage

[React.js](http://facebook.github.io/react/) and [date-fns](https://date-fns.org/) are peer dependencies for react-datetime. These dependencies are not installed along with react-datetime automatically, but your project needs to have them installed in order to make the datepicker work. You can then use the datepicker like in the example below.

```js
import DateTime from "@nateradebaugh/react-datetime";
import "@nateradebaugh/react-datetime/scss/styles.css";

...

render() {
    return <DateTime />;
}
```

[See this example working](https://codesandbox.io/s/jz6kwnjq9y).

**Don't forget to add the [SCSS stylesheet](https://github.com/NateRadebaugh/react-datetime/blob/master/css/react-datetime.css) to make it work out of the box.**

## API

| Name                | Type                       | Default        | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | -------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **value**           | `Date`                     | `new Date()`   | Represents the selected date by the component, in order to use it as a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components). This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.                                                                                                            |
| **defaultValue**    | `Date`                     | `new Date()`   | Represents the selected date for the component to use it as a [uncontrolled component](https://facebook.github.io/react/docs/uncontrolled-components.html). This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.                                                                                                                       |
| **viewDate**        | `Date`                     | `new Date()`   | Represents the month which is viewed on opening the calendar when there is no selected date. This prop is parsed by date-fns, so it is possible to use a date `string` or a `Date` object.                                                                                                                                                                                      |
| **dateFormat**      | `boolean` or `string`      | `true`         | Defines the format for the date. It accepts any [date-fns date format](https://date-fns.org/v1.29.0/docs/format) (not in localized format). If `true` the date will be displayed using the defaults for the current locale. If `false` the datepicker is disabled and the component can be used as timepicker, see [available units docs](#specify-available-units).            |
| **timeFormat**      | `boolean` or `string`      | `true`         | Defines the format for the time. It accepts any [date-fns time format](https://date-fns.org/v1.29.0/docs/format) (not in localized format). If `true` the time will be displayed using the defaults for the current locale. If `false` the timepicker is disabled and the component can be used as datepicker, see [available units docs](#specify-available-units).            |
| **input**           | `boolean`                  | `true`         | Whether to show an input field to edit the date manually.                                                                                                                                                                                                                                                                                                                       |
| **open**            | `boolean`                  | `null`         | Whether to open or close the picker. If not set react-datetime will open the datepicker on input focus and close it on click outside.                                                                                                                                                                                                                                           |
| **locale**          | `string`                   | `null`         | Manually set the locale for the react-datetime instance. date-fns locale needs to be loaded to be used, see [i18n docs](#i18n).                                                                                                                                                                                                                                                 |
| **utc**             | `boolean`                  | `false`        | When true, input time values will be interpreted as UTC (Zulu time) by date-fns. Otherwise they will default to the user's local timezone.                                                                                                                                                                                                                                      |
| **onChange**        | `function`                 | empty function | Callback trigger when the date changes. The callback receives the selected `Date` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback receives the value of the input (a string).                                                                                                                                  |
| **onFocus**         | `function`                 | empty function | Callback trigger for when the user opens the datepicker. The callback receives an event of type SyntheticEvent.                                                                                                                                                                                                                                                                 |
| **onBlur**          | `function`                 | empty function | Callback trigger for when the user clicks outside of the input, simulating a regular onBlur. The callback receives the selected `Date` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback returned.                                                                                                               |
| **viewMode**        | `string` or `number`       | `'days'`       | The default view to display when the picker is shown (`'years'`, `'months'`, `'days'`, `'time'`).                                                                                                                                                                                                                                                                               |
| **className**       | `string` or `string array` | `''`           | Extra class name for the outermost markup element.                                                                                                                                                                                                                                                                                                                              |
| **isValidDate**     | `function`                 | `() => true`   | Define the dates that can be selected. The function receives `(currentDate, selectedDate)` and shall return a `true` or `false` whether the `currentDate` is valid or not. See [selectable dates](#selectable-dates).                                                                                                                                                           |
| **timeConstraints** | `object`                   | `null`         | Add some constraints to the timepicker. It accepts an `object` with the format `{ hours: { min: 9, max: 15, step: 2 }}`, this example means the hours can't be lower than `9` and higher than `15`, and it will change adding or subtracting `2` hours everytime the buttons are clicked. The constraints can be added to the `hours`, `minutes`, `seconds` and `milliseconds`. |

## i18n

Different language and date formats are supported by `react-datetime`. `react-datetime` uses [date-fns](https://date-fns.org/) to format the dates, and the easiest way of changing the language of the calendar is providing a `locale` prop. See date-fns documentation here: [changing the date-fns locale](https://date-fns.org/v1.29.0/docs/I18n).

```js
import DateTime from "@nateradebaugh/react-datetime";
import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";
```

You can then use the prop `locale` to define what language shall be used by the instance.

```js
<DateTime locale={nl} />
<DateTime locale={es} />
<DateTime locale={fr} />
```

## Customize appearance

It is possible to customize the way that the input displays using `className` and `styles` prop.

#### Method Parameters

- `props` is the object that the datepicker has calculated for this object. It is convenient to use this object as the `props` for your custom component, since it knows how to handle the click event and its `className` attribute is used by the default styles.
- `selectedDate` and `currentDate` are native `Date` objects and can be used to change the output depending on the selected date, or the date for the current day.
- `month` and `year` are the numeric representation of the current month and year to be displayed. Notice that the possible `month` values range from `0` to `11`.

## Specify Available Units

You can filter out what you want the user to be able to pick by using `dateFormat` and `timeFormat`, e.g. to create a timepicker, yearpicker etc.

```js
<DateTime dateFormat={false} />
```

```js
<DateTime dateFormat="YYYY-MM" timeFormat={false} />
```

[Working example of only selecting year and month here.](https://codesandbox.io/s/31vz49pjz1)

## Selectable Dates

It is possible to disable dates in the calendar if the user are not allowed to select them, e.g. dates in the past. This is done using the prop `isValidDate`, which admits a function in the form `function(currentDate, selectedDate)` where both arguments are native `Date` objects. The function shall return `true` for selectable dates, and `false` for disabled ones.

In the example below are _all dates before today_ disabled.

```js
import subDays from "date-fns/sub_days";
import isAfter from "date-fns/is_after";

const yesterday = subDays(new Date(), 1);
const valid = function(current) {
  return isAfter(current, yesterday);
};

<DateTime isValidDate={valid} />;
```

It's also possible to disable _the weekends_, as shown in the example below.

```js
import getDay from "date-fns/get_day";

const valid = function(current) {
  return getDay(current) !== 0 && getDay(current) !== 6;
};

<DateTime isValidDate={valid} />;
```

## Usage with TypeScript

This project includes typings. Additional typings are not
required.

Typings are bundled with the project and should _just work_.

## Contributions

For information about how to contribute, see the [CONTRIBUTING](.github/CONTRIBUTING.md) file.

### [Changelog](CHANGELOG.md)

### [MIT Licensed](LICENSE.md)
