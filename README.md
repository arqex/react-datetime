# react-datetime

[![Build Status](https://secure.travis-ci.org/arqex/react-datetime.svg)](https://travis-ci.org/arqex/react-datetime)
[![npm version](https://badge.fury.io/js/react-datetime.svg)](http://badge.fury.io/js/react-datetime)

A date and time picker in the same React.js component. It can be used as a datepicker, timepicker or both at the same time. It is **highly customizable** and it even allows to edit date's milliseconds.

> **Back to the roots!** Thanks to the people of [YouCanBook.me (best scheduling tool)](https://youcanbook.me) for sponsoring react-datetime for so long. Now the project returns to the community and we are **looking for contributors** to continue improving react-datetime. [Would you like to give a hand?](contribute-home.md)

**Version 3 is out!** These are the docs for version 3 of the library. If you are still using the deprecated v2, [here it is its documentation](https://github.com/arqex/react-datetime/blob/2a83208452ac5e41c43fea31ef47c65efba0bb56/README.md), but we strongly recommend to migrate to version 3 in order to keep receiving updates. Please check [migrating react-datetime to version 3](migrateToV3.md) to safely update your app.

## Installation

Install using npm:
```sh
npm install --save react-datetime
```

Install using yarn:
```sh
yarn add react-datetime
```

## Usage

[React.js](http://facebook.github.io/react/) and [Moment.js](http://momentjs.com/) are peer dependencies for react-datetime (as well as [Moment.js timezones](https://momentjs.com/timezone/) if you want to use the `displayTimeZone` prop). These dependencies are not installed along with react-datetime automatically, but your project needs to have them installed in order to make the datepicker work. You can then use the datepicker like in the example below.

```js
// Import the library
import Datetime from 'react-datetime';

// return it from your components
return <Datetime />;
```
[See this example working](https://codesandbox.io/s/boring-dew-uzln3).

Do you want more examples? [Have a look at our resources gallery](resources.md).

**Don't forget to add the [CSS stylesheet](https://github.com/arqex/react-datetime/blob/master/css/react-datetime.css) to make it work out of the box.**. You only need to do this once in your app:

```js
import "react-datetime/css/react-datetime.css";
```

## API

Below we have all the props that we can use with the `<DateTime>` component. There are also some methods that can be used imperatively.

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **value** | `Date` | `new Date()` | Represents the selected date by the component, in order to use it as a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components). This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. |
| **initialValue** | `Date` | `new Date()` | Represents the selected date for the component to use it as a [uncontrolled component](https://facebook.github.io/react/docs/uncontrolled-components.html). This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. If you need to set the selected date programmatically after the picker is initialized, please use the `value` prop instead. |
| **initialViewDate** | `Date` | `new Date()` | Define the month/year/decade/time which is viewed on opening the calendar. This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. If you want to set the view date after the component has been initialize [see the imperative API](#imperative-api). |
| **initialViewMode** | `string` or `number` | `'days'` | The default view to display when the picker is shown for the first time (`'years'`, `'months'`, `'days'`, `'time'`). If you want to set the view mode after the component has been initialize [see the imperative API](#imperative-api). |
| **updateOnView** | `string` | Intelligent guess | By default we can navigate through years and months without actualling updating the selected date. Only when we get to one view called the "updating view", we make a selection there and the value gets updated, triggering an `onChange` event. By default the updating view will get guessed by using the `dateFormat` so if our dates only show months and never days, the update is done in the `months` view. If we set `updateOnView="time"` selecting a day will navigate to the time view. The time view always updates the selected date, never navigates. If `closeOnSelect={ true }`, making a selection in the view defined by `updateOnView` will close the calendar. |
| **dateFormat**   | `boolean` or `string`  | `true` | Defines the format for the date. It accepts any [Moment.js date format](http://momentjs.com/docs/#/displaying/format/) (not in localized format). If `true` the date will be displayed using the defaults for the current locale. If `false` the datepicker is disabled and the component can be used as timepicker, see [available units docs](#specify-available-units). |
| **timeFormat**   | `boolean` or `string`  | `true` | Defines the format for the time. It accepts any [Moment.js time format](http://momentjs.com/docs/#/displaying/format/) (not in localized format). If `true` the time will be displayed using the defaults for the current locale. If `false` the timepicker is disabled and the component can be used as datepicker, see [available units docs](#specify-available-units). |
| **input** | `boolean` | `true` | Whether to show an input field to edit the date manually. |
| **open** | `boolean` | `null` | Whether to open or close the picker. If not set react-datetime will open the datepicker on input focus and close it on click outside. |
| **locale** | `string` | `null` | Manually set the locale for the react-datetime instance. Moment.js locale needs to be loaded to be used, see [i18n docs](#i18n).
| **utc** | `boolean` | `false` | When true, input time values will be interpreted as UTC (Zulu time) by Moment.js. Otherwise they will default to the user's local timezone.
| **displayTimeZone** | `string` | `null` | **Needs [moment's timezone](https://momentjs.com/timezone/) available in your project.** When specified, input time values will be displayed in the given time zone. Otherwise they will default to the user's local timezone (unless `utc` specified).
| **onChange** | `function` | empty function | Callback trigger when the date changes. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback receives the value of the input (a string). |
| **onOpen** | `function` | empty function | Callback trigger for when the user opens the datepicker. |
| **onClose** | `function` | empty function | Callback trigger for when the calendar get closed. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback returns the value in the input. |
| **onNavigate** | `function` | empty function | Callback trigger when the view mode changes. The callback receives the selected view mode string (`years`, `months`, `days` or `time`) as only parameter.|
| **onBeforeNavigate** | `function` | ( nextView, currentView, viewDate ) => nextView | Allows to intercept a change of the calendar view. The accepted function receives the view that it's supposed to navigate to, the view that is showing currently and the date currently shown in the view. Return a viewMode ( default ones are `years`, `months`, `days` or `time`) to navigate to it. If the function returns a "falsy" value, the navigation is stopped and we will remain in the current view. |
| **onNavigateBack** | `function` | empty function | Callback trigger when the user navigates to the previous month, year or decade. The callback receives the amount and type ('month', 'year') as parameters. |
| **onNavigateForward** | `function` | empty function | Callback trigger when the user navigates to the next month, year or decade. The callback receives the amount and type ('month', 'year') as parameters. |
| **className** | `string` or `string array` | `''` | Extra class name for the outermost markup element. |
| **inputProps** | `object` | `undefined` | Defines additional attributes for the input element of the component. For example: `onClick`, `placeholder`, `disabled`, `required`, `name` and `className` (`className` *sets* the class attribute for the input element). See [Customize the Input Appearance](#customize-the-input-appearance). |
| **isValidDate** | `function` | `() => true` | Define the dates that can be selected. The function receives `(currentDate, selectedDate)` and shall return a `true` or `false` whether the `currentDate` is valid or not. See [selectable dates](#selectable-dates).|
| **renderInput** | `function` | `undefined` | Replace the rendering of the input element. The function has the following arguments: the default calculated `props` for the input, `openCalendar` (a function which opens the calendar) and `closeCalendar` (a function which closes the calendar). Must return a React component or `null`. See [Customize the Input Appearance](#customize-the-input-appearance). |
| **renderView** | `function` | `(viewMode, renderDefault) => renderDefault()` | Customize the way the calendar is rendered. The accepted function receives the type of the view it's going to be rendered `'years', 'months', 'days', 'time'` and a function to render the default view of react-datetime, this way it's possible to wrap the original view adding our own markup or override it completely with our own code. See [Customize the Datepicker Appearance](#customize-the-datepicker-appearance). |
| **renderDay** | `function` | `DOM.td(day)` | Customize the way that the days are shown in the daypicker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component. See [Customize the Datepicker Appearance](#customize-the-datepicker-appearance). |
| **renderMonth** | `function` | `DOM.td(month)` | Customize the way that the months are shown in the monthpicker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `month` and the `year` to be shown, and must return a React component. See [Customize the Datepicker Appearance](#customize-the-datepicker-appearance). |
| **renderYear** | `function` | `DOM.td(year)` | Customize the way that the years are shown in the year picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `year` to be shown, and must return a React component. See [Customize the Datepicker Appearance](#customize-the-datepicker-appearance). |
| **strictParsing** | `boolean` | `true` | Whether to use Moment.js's [strict parsing](http://momentjs.com/docs/#/parsing/string-format/) when parsing input.
| **closeOnSelect** | `boolean` | `false` | When `true`, once the day has been selected, the datepicker will be automatically closed.
| **closeOnTab** | `boolean` | `true` | When `true` and the input is focused, pressing the `tab` key will close the datepicker.
| **timeConstraints** | `object` | `null` | Add some constraints to the timepicker. It accepts an `object` with the format `{ hours: { min: 9, max: 15, step: 2 }}`, this example means the hours can't be lower than `9` and higher than `15`, and it will change adding or subtracting `2` hours everytime the buttons are clicked. The constraints can be added to the `hours`, `minutes`, `seconds` and `milliseconds`.
| **closeOnClickOutside** | `boolean` | `true` | When the calendar is open and `closeOnClickOutside` is `true` (its default value), clickin outside of the calendar or input closes the calendar. If `false` the calendar stays open.

## Imperative API
Besides controlling the selected date, there is a navigation through months, years, decades that react-datetime handles for us. We can interfere in it, stopping view transtions by using the prop `onBeforeNavigate`, but we can also navigate to a specific view and date by using some imperative methods.

To do so, we need to create our component with a `ref` prop amd use the reference.
```js
// This would be the code to render the picker
<DateTime ref="datetime" />

// ... once rendered we can use the imperative API
// let's show the years view
this.refs.datetime.navigate('years')
```

Available methods are:
* **navigate( viewMode )**: Set the view currently shown by the calendar. View modes shipped with react-datetime are `years`, `months`, `days` and `time`, but you can alse navigate to custom modes that can be defined by using the `renderView` prop.
* **setViewDate( date )**: Set the date that is currently shown in the calendar. This is independent from the selected date and it's the one used to navigate through months or days in the calendar. It accepts a string in the format of the current locale, a `Date` or a `Moment` object as parameter.

## i18n
Different language and date formats are supported by react-datetime. React uses [Moment.js](http://momentjs.com/) to format the dates, and the easiest way of changing the language of the calendar is [changing the Moment.js locale](http://momentjs.com/docs/#/i18n/changing-locale/).

Don't forget to import your locale file from the moment's `moment/locale` folder.

```js
import moment from 'moment';
import 'moment/locale/fr';
// Now react-datetime will be in french
```

If there are multiple locales loaded, you can use the prop `locale` to define what language shall be used by the instance.
```js
<Datetime locale="fr-ca" />
<Datetime locale="de" />
```
[Here you can see the i18n example working](https://codesandbox.io/s/interesting-kare-0707b).

## Customize the Input Appearance
It is possible to customize the way that the input is displayed. The simplest is to supply `inputProps` which will get directly assigned to the `<input />` element within the component. We can tweak the inputs this way:

```js
let inputProps = {
    placeholder: 'N/A',
    disabled: true,
    onMouseLeave: () => alert('You went to the input but it was disabled')
};

<Datetime inputProps={ inputProps } />
```
[See the customized input working](https://codesandbox.io/s/clever-wildflower-81r26?file=/src/App.js)


Alternatively, if you need to render different content than an `<input />` element, you may supply a `renderInput` function which is called instead.

```js
class MyDTPicker extends React.Component {
    render(){
        return <Datetime renderInput={ this.renderInput } />;
    }
    renderInput( props, openCalendar, closeCalendar ){
        function clear(){
            props.onChange({target: {value: ''}});
        }
        return (
            <div>
                <input {...props} />
                <button onClick={openCalendar}>open calendar</button>
                <button onClick={closeCalendar}>close calendar</button>
                <button onClick={clear}>clear</button>
            </div>
        );
    }
}
```

[See this example working](https://codesandbox.io/s/peaceful-water-3gb5m)


Or maybe you just want to shown the calendar and don't need an input at all. In that case `input={ false }` will make the trick:

```js
    <Datetime input={ false } />;
```
[See react-datetime calendar working without an input](https://codesandbox.io/s/busy-vaughan-wh773)

## Customize the Datepicker Appearance
It is possible to customize the way that the datepicker display the days, months and years in the calendar. To adapt the calendar for every need it is possible to use the props `renderDay(props, currentDate, selectedDate)`, `renderMonth(props, month, year, selectedDate)` and `renderYear(props, year, selectedDate)` to customize the output of each rendering method.

```js
class MyDTPicker extends React.Component {
  render() {
    return (
      <Datetime
        renderDay={this.renderDay}
        renderMonth={this.renderMonth}
        renderYear={this.renderYear}
      />
    );
  }
  renderDay(props, currentDate, selectedDate) {
    // Adds 0 to the days in the days view
    return <td {...props}>{"0" + currentDate.date()}</td>;
  }
  renderMonth(props, month, year, selectedDate) {
    // Display the month index in the months view
    return <td {...props}>{month}</td>;
  }
  renderYear(props, year, selectedDate) {
    // Just display the last 2 digits of the year in the years view
    return <td {...props}>{year % 100}</td>;
  }
}
```
[See the customized calendar here.](https://codesandbox.io/s/peaceful-kirch-69e06)

It's also possible to override some view in the calendar completelly. Let's say that we want to add a today button in our calendars, when we click it we go to the today view:
```js
class MyDTPicker extends React.Component {
  render() {
    return (
      <Datetime
        ref="datetime"
        renderView={(mode, renderDefault) =>
          this.renderView(mode, renderDefault)
        }
      />
    );
  }

  renderView(mode, renderDefault) {
    // Only for years, months and days view
    if (mode === "time") return renderDefault();

    return (
      <div className="wrapper">
        {renderDefault()}
        <div className="controls">
          <button onClick={() => this.goToToday()}>Today</button>
        </div>
      </div>
    );
  }

  goToToday() {
    // Reset
    this.refs.datetime.setViewDate(new Date());
    this.refs.datetime.navigate("days");
  }
}
```
[See it working](https://codesandbox.io/s/frosty-fog-nrwk2)

#### Method Parameters
* `props` is the object that the datepicker has calculated for this object. It is convenient to use this object as the `props` for your custom component, since it knows how to handle the click event and its `className` attribute is used by the default styles.
* `selectedDate` and `currentDate` are [moment objects](http://momentjs.com) and can be used to change the output depending on the selected date, or the date for the current day.
* `month` and `year` are the numeric representation of the current month and year to be displayed. Notice that the possible `month` values range from `0` to `11`.

## Make it work as a year picker or a time picker
You can filter out what you want the user to be able to pick by using `dateFormat` and `timeFormat`, e.g. to create a timepicker, yearpicker etc.

In this example the component is being used as a *timepicker* and can *only be used for selecting a time*.
```js
<Datetime dateFormat={false} />
```
[Working example of a timepicker here.](https://codesandbox.io/s/loving-nobel-sbok2)

In this example you can *only select a year and month*.
```js
<Datetime dateFormat="YYYY-MM" timeFormat={false} />
```
[Working example of only selecting year and month here.](https://codesandbox.io/s/recursing-pascal-xl643)

## Blocking some dates to be selected
It is possible to disable dates in the calendar if the user are not allowed to select them, e.g. dates in the past. This is done using the prop `isValidDate`, which admits a function in the form `function(currentDate, selectedDate)` where both arguments are [moment objects](http://momentjs.com). The function shall return `true` for selectable dates, and `false` for disabled ones.

In the example below are *all dates before today* disabled.

```js
import moment from 'moment';
var yesterday = moment().subtract( 1, 'day' );
var valid = function( current ){
    return current.isAfter( yesterday );
};
<Datetime isValidDate={ valid } />
```
[Working example of disabled days here.](https://codesandbox.io/s/thirsty-shape-l4qg4)

It's also possible to disable *the weekends*, as shown in the example below.
```js
var valid = function( current ){
    return current.day() !== 0 && current.day() !== 6;
};
<Datetime isValidDate={ valid } />
```
[Working example of disabled weekends here.](https://codesandbox.io/s/laughing-keller-3wq1g)

## Usage with TypeScript

This project includes typings for TypeScript versions 1.8 and 2.0. Additional typings are not
required.

Typings for 1.8 are found in `react-datetime.d.ts` and typings for 2.0 are found in `typings/index.d.ts`.

```js
import * as Datetime from 'react-datetime';

class MyDTPicker extends React.Component<MyDTPickerProps, MyDTPickerState> {
    render() JSX.Element {
        return <Datetime />;
    }
}
```

## Contributions
react-datetime is made by the community for the community. People like you, interested in contribute, are the key of the project! 🙌🙌🙌

Have a look at [our contribute page](contribute-home.md) to know how to get started.

### [Changelog](CHANGELOG.md)

### [MIT Licensed](LICENSE.md)
