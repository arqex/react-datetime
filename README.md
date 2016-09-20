# react-datetime

[![Build Status](https://secure.travis-ci.org/YouCanBookMe/react-datetime.svg)](https://travis-ci.org/YouCanBookMe/react-datetime)
[![npm version](https://badge.fury.io/js/react-datetime.svg)](http://badge.fury.io/js/react-datetime)
[![npm](http://img.shields.io/npm/dm/react-datetime.svg)](https://npmjs.org/package/react-datetime)

A date and time picker in the same React.js component. It can be used as a datepicker, timepicker or both at the same time. It is **highly customizable** and it even allows to edit date's milliseconds.

This project started as a fork of https://github.com/quri/react-bootstrap-datetimepicker but the code and the API has changed a lot.

## Usage

Install using `npm`:
```
npm install --save react-datetime
```

[React.js](http://facebook.github.io/react/) and [Moment.js](http://momentjs.com/) are peer dependencies for react-datetime. These dependencies are not installed along with react-datetime automatically, but your project needs to have them installed in order to make the datepicker work. You can then use the datepicker like in the example below.


```js
require('react-datetime');

...

render: function() {
  return <Datetime />;
}
```
[See this example working](http://codepen.io/simeg/pen/mEmQmP).

**Don't forget to add the [CSS stylesheet](https://github.com/arqex/react-datetime/blob/master/css/react-datetime.css) to make it work out of the box.**

## API

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **value** | `Date` | `new Date()` | Represents the selected date by the component, in order to use it as a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components). This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. |
| **defaultValue** | `Date` | `new Date()` | Represents the selected date for the component to use it as a [uncontrolled component](https://facebook.github.io/react/docs/forms.html#uncontrolled-components). This prop is parsed by Moment.js, so it is possible to use a date `string` or a `moment` object. |
| **dateFormat**   | `boolean` or `string`  | `true` | Defines the format for the date. It accepts any [Moment.js date format](http://momentjs.com/docs/#/displaying/format/) (not in localized format). If `true` the date will be displayed using the defaults for the current locale. If `false` the datepicker is disabled and the component can be used as timepicker. |
| **timeFormat**   | `boolean` or `string`  | `true` | Defines the format for the time. It accepts any [Moment.js time format](http://momentjs.com/docs/#/displaying/format/) (not in localized format). If `true` the time will be displayed using the defaults for the current locale. If `false` the timepicker is disabled and the component can be used as datepicker. |
| **input** | `boolean` | `true` | Whether to show an input field to edit the date manually. |
| **open** | `boolean` | `null` | Whether to open or close the picker. If not set react-datetime will open the datepicker on input focus and close it on click outside. |
| **locale** | `string` | `null` | Manually set the locale for the react-datetime instance. Moment.js locale needs to be loaded to be used, see [i18n docs](#i18n).
| **onChange** | `function` | empty function | Callback trigger when the date changes. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback receives the value of the input (a string). |
| **onFocus** | `function` | empty function | Callback trigger for when the user opens the datepicker. |
| **onBlur** | `function` | empty function | Callback trigger for when the user clicks outside of the input, simulating a regular onBlur. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If the date in the input is not valid, the callback returned. |
| **viewMode** | `string` or `number` | `'days'` | The default view to display when the picker is shown (`'years'`, `'months'`, `'days'`, `'time'`). |
| **className** | `string` or `string array` | `''` | Extra class name for the outermost markup element. |
| **inputProps** | `object` | `undefined` | Defines additional attributes for the input element of the component. For example: `placeholder`, `disabled` and `required`. |
| **isValidDate** | `function` | `() => true` | Define the dates that can be selected. The function receives `(currentDate, selectedDate)` and should return a `true` or `false` whether the `currentDate` is valid or not. See [selectable dates](#selectable-dates).|
| **renderDay** | `function` | `DOM.td(day)` | Customize the way that the days are shown in the daypicker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component. See [appearance customization](#appearance-customization). |
| **renderMonth** | `function` | `DOM.td(month)` | Customize the way that the months are shown in the monthpicker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `month` and the `year` to be shown, and must return a React component. See [appearance customization](#appearance-customization). |
| **renderYear** | `function` | `DOM.td(year)` | Customize the way that the years are shown in the year picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `year` to be shown, and must return a React component. See [appearance customization](#appearance-customization). |
| **strictParsing** | `boolean` | `false` | Whether to use Moment.js's [strict parsing](http://momentjs.com/docs/#/parsing/string-format/) when parsing input.
| **closeOnSelect** | `boolean` | `false` | When `true`, once the day has been selected, the datepicker will be automatically closed.
| **closeOnTab** | `boolean` | `true` | When `true` and the input is focused, pressing the `tab` key will close the datepicker.
| **timeConstraints** | `object` | `null` | Add some constraints to the timepicker. It accepts an `object` with the format `{ hours: { min: 9, max: 15, step: 2 }}`, this example means the hours can't be lower than `9` and higher than `15`, and it will change adding or subtracting `2` hours everytime the buttons are clicked. The constraints can be added to the `hours`, `minutes`, `seconds` and `milliseconds`.
| **disableOnClickOutside** | `boolean` | `false` | When `true`, keep the datepicker open when click event is triggered outside of component. When `false`, close it.

## i18n
Different language and date formats are supported by react-datetime. React uses [Moment.js](http://momentjs.com/) to format the dates, and the easiest way of changing the language of the calendar is [changing the Moment.js locale](http://momentjs.com/docs/#/i18n/changing-locale/).

```js
var moment = require('moment');
require('moment/locale/fr');
// Now react-datetime will be in french
```

If there are multiple locales loaded, you can use the prop `locale` to define what language should be used by the instance.
```js
<Datetime locale="fr-ca" />
<Datetime locale="de" />
```
[Here you can see the i18n example working](http://codepen.io/arqex/pen/PqJMQV).

## Appearance customization
It is possible to customize the way that the datepicker display the days, months and years in the calendar. To adapt the calendar for every need it is possible to use the props `renderDay(props, currentDate, selectedDate)`, `renderMonth(props, month, year, selectedDate)` and `renderYear(props, year, selectedDate)` to customize the output of each rendering method.

```js
var MyDTPicker = React.createClass({
    render: function(){
        return <Datetime
            renderDay={ this.renderDay }
            renderMonth={ this.renderMonth }
            renderYear={ this.renderYear }
        />;
    },
    renderDay: function( props, currentDate, selectedDate ){
        return <td {...props}>{ '0' + currentDate.date() }</td>;
    },
    renderMonth: function( props, month, year, selectedDate){
        return <td {...props}>{ month }</td>;
    },
    renderYear: function( props, year, selectedDate ){
        return <td {...props}>{ year % 100 }</td>;
    }
});
```
[You can see a customized calendar here.](http://codepen.io/arqex/pen/mJzRwM)

#### Method parameters
* `props` is the object that the datepicker has calculated for this object. It is convenient to use this object as the `props` for your custom component, since it knows how to handle the click event and its `className` attribute is used by the default styles.
* `selectedDate` and `currentDate` are [moment objects](http://momentjs.com) and can be used to change the output depending on the selected date, or the date for the current day.
* `month` and `year` are the numeric representation of the current month and year to be displayed. Notice that the possible `month` values range from `0` to `11`.

## Selectable dates
It is possible to disable dates in the calendar if the user are not allowed to select them. It is done using the prop `isValidDate`, which admits a function in the form `function(currentDate, selectedDate)` where both arguments are [moment objects](http://momentjs.com). The function should return `true` for selectable dates, and `false` for disabled ones.

In the example below are *all dates before today* disabled.

```js
// Let's use the static moment reference in the Datetime component
var yesterday = Datetime.moment().subtract(1, 'day');
var valid = function( current ){
    return current.isAfter( yesterday );
};
<Datetime isValidDate={ valid } />
```
[Working example of disabled days here.](http://codepen.io/arqex/pen/jPeyGX)

It's also possible to disable *the weekends*, as shown in the example below.
```js
var valid = function( current ){
    return current.day() !== 0 && current.day() !== 6;
};
<Datetime isValidDate={ valid } />
```
[Working example of disabled weekends here.](http://codepen.io/arqex/pen/VLEPXb)

## Contributions
* For information about how to contribute, see the [CONTRIBUTING](CONTRIBUTING.md) file.
* For development we recommend that you use [react-datetime-playground](https://github.com/arqex/react-datetime-playground).

### [Changelog](CHANGELOG.md)

### [MIT Licensed](LICENSE)
