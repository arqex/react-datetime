react-datetime
===============================
A date and time picker in the same React.js component. It can be used as a datepicker, timepicker or both at the same time.

[![Build Status](https://secure.travis-ci.org/YouCanBookMe/react-datetime.svg)](https://travis-ci.org/YouCanBookMe/react-datetime)
[![npm version](https://badge.fury.io/js/react-datetime.svg)](http://badge.fury.io/js/react-datetime)

It allows to edit even date's milliseconds.

This project started as a fork of https://github.com/quri/react-bootstrap-datetimepicker but the code and the API has changed a lot.

Usage
===============================

Installation:
```
npm install --save react-datetime
```

[React.js](http://facebook.github.io/react/) and [Moment.js](http://momentjs.com/) are peer dependencies for react-datetime. These dependencies are not installed along with react-datetime automatically, but your project needs to have them installed in order to make the datetime picker work.

Then
```javascript
require('react-datetime');

...

render: function() {
  return <Datetime />;
}
```
[See this example working](http://codepen.io/simeg/pen/mEmQmP).

**Don't forget to add the [CSS stylesheet](https://github.com/arqex/react-datetime/blob/master/css/react-datetime.css) to make it work out of the box.**

Build the component (Mac / Linux):
```
npm run build:mac
```

Build the component (Windows):
```
npm run build:windows
```

API
===============================

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **value** | Date | new Date() | Represents the selected date by the component, in order to use it as a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components). This prop is parsed by moment.js, so it is possible to use a date string or a moment.js date. |
| **defaultValue** | Date | new Date() | Represents the selected date for the component to use it as a [uncontrolled component](https://facebook.github.io/react/docs/forms.html#uncontrolled-components). This prop is parsed by moment.js, so it is possible to use a date string or a moment.js date. |
| **dateFormat**   | `bool` or `string`  | `true` | Defines the format for the date. It accepts any [moment.js date format](http://momentjs.com/docs/#/displaying/format/). If `true` the date will be displayed using the defaults for the current locale. If `false` the datepicker is disabled and the component can be used as timepicker. |
| **timeFormat**   | `bool` or `string`  | `true` | Defines the format for the time. It accepts any [moment.js time format](http://momentjs.com/docs/#/displaying/format/). If `true` the time will be displayed using the defaults for the current locale. If `false` the timepicker is disabled and the component can be used as datepicker. |
| **input** | boolean | true | Wether to show an input field to edit the date manually. |
| **open** | boolean | null | Wether to open or close the picker. If not set react-datetime will open the datepicker on input focus and close it on click outside. |
| **locale** | string | null | Manually set the locale for the react-datetime instance. Moment.js locale needs to be loaded to be used, see [i18n docs](#i18n).
| **onChange** | function | empty function | Callback trigger when the date changes. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If it isn't, the value of the input (a string) is returned. |
| **onFocus** | function | empty function | Callback trigger for when the user opens the datepicker. |
| **onBlur** | function | empty function | Callback trigger for when the user clicks outside of the input, simulating a regular onBlur. The callback receives the selected `moment` object as only parameter, if the date in the input is valid. If it isn't, the value of the input (a string) is returned. |
| **viewMode** | string or number | 'days' | The default view to display when the picker is shown. ('years', 'months', 'days', 'time') |
| **className** | string | `""` | Extra class names for the component markup. |
| **inputProps** | object | undefined | Defines additional attributes for the input element of the component. |
| **isValidDate** | function | () => true | Define the dates that can be selected. The function receives `(currentDate, selectedDate)` and should return a `true` or `false` whether the `currentDate` is valid or not. See [selectable dates](#selectable-dates).|
| **renderDay** | function | DOM.td( day ) | Customize the way that the days are shown in the day picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component. See [appearance customization](#appearance-customization) |
| **renderMonth** | function | DOM.td( month ) | Customize the way that the months are shown in the month picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `month` and the `year` to be shown, and must return a React component. See [appearance customization](#appearance-customization) |
| **renderYear** | function | DOM.td( year ) | Customize the way that the years are shown in the year picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, the `year` to be shown, and must return a React component. See [appearance customization](#appearance-customization) |
| **strictParsing** | boolean | false | Whether to use moment's [strict parsing](http://momentjs.com/docs/#/parsing/string-format/) when parsing input.
| **closeOnSelect** | boolean | false | When `true`, once the day has been selected, the react-datetime will be automatically closed.
| **closeOnTab** | boolean | true | When `true` and the input is focused, pressing the `tab` key will close the picker.
| **timeConstraints** | object | null | Allow to add some constraints to the time selector. It accepts an object with the format `{hours:{ min: 9, max: 15, step:2}}` so the hours can't be lower than 9 or higher than 15, and it will change adding or subtracting 2 hours everytime the buttons are clicked. The constraints can be added to the `hours`, `minutes`, `seconds` and `milliseconds`.

## i18n
Different language and date formats are supported by react-datetime. React uses [moment.js](http://momentjs.com/) to format the dates, and the easiest way of changing the language of the calendar is [changing the moment.js locale](http://momentjs.com/docs/#/i18n/changing-locale/).

```js
var moment = require('moment');
require('moment/locale/fr');
// Now react-datetime will be in french
```

If there are multiple locales loaded, you can use the prop `locale` to define what language should be used by the instance:
```js
<Datetime locale="fr-ca" />
<Datetime locale="de" />
```
[Here you can see the i18n example working](http://codepen.io/arqex/pen/PqJMQV).

## Appearance customization
It is possible to customize the way that the datetime picker display the days, months and years in the calendar. To adapt the calendar to every need it is possible to use the props `renderDay( props, currentDate, selectedDate )`, `renderMonth( props, month, year, selectedDate )` and `renderYear( props, year, selectedDate )` of react-datetime.

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
[You can see this customized calendar here.](http://codepen.io/arqex/pen/mJzRwM)

* `props` is the object that react-date picker has calculated for this object. It is convenient to use this object as the props for your custom component, since it knows how to handle the click event and its `className` attribute is used by the default styles.
* `selectedDate` and `currentDate` are Moment.js objects and can be used to change the output depending on the selected date, or the date for the current day.
* `month` and `year` are the numeric representation of the current month and year to be displayed. Notice that the possible `month` values go from `0` to `11`.

## Selectable dates
It is possible to disable dates in the calendar if we don't want the user to select them. It is possible thanks to the prop `isValidDate`, which admits a function in the form `function( currentDate, selectedDate )` where both arguments are moment.js objects. The function should return `true` for selectable dates, and `false` for disabled ones.

If we want to disable all the dates before today we can do like
```js
// Let's use moment static reference in the Datetime component.
var yesterday = Datetime.moment().subtract(1,'day');
var valid = function( current ){
    return current.isAfter( yesterday );
};
<Datetime isValidDate={ valid } />
```
[See the isValidDate prop working here](http://codepen.io/arqex/pen/jPeyGX).

If we want to disable the weekends
```js
var valid = function( current ){
    return current.day() != 0 && current.day() != 6;
};
<Datetime isValidDate={ valid } />
```
[The example working here](http://codepen.io/arqex/pen/VLEPXb).

Contributions
===============================
Any help is always welcome :)

**Please use the linter before submitting your pull request.**

```
npm run lint
```

### [Changelog](CHANGELOG.md)

### [MIT Licensed](LICENSE)
