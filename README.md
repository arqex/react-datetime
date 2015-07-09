react-datetime
===============================
A date and time picker in the same React.js component. It can be used as a datepicker, timepicker or both at the same time.

It allows to edit even date's milliseconds.

This project started as a fork of https://github.com/quri/react-bootstrap-datetimepicker but the code and the API has changed a lot.

Usage
===============================

Installation :
```
npm install react-datetime
```

Then
```javascript
require('react-datetime');

...

render: function() {
  return <Datetime />;
}
```
[See this example working](http://codepen.io/arqex/pen/BNRNBw).

API
===============================

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **date** | Date  | new Date() | Represents the inital dateTime, this string is then parsed by moment.js |
| **dateFormat**   | string  | Locale default | Defines the format moment.js should use to parse and output the date. The default is only set if there is not `timeFormat` defined. |
| **timeFormat**   | string  | Locale default | Defines the format moment.js should use to parse and output the time. The default is only set if there is not `dateFormat` defined. |
| **input** | boolean | true | Wether to show an input field to edit the date manually. |
| **locale** | string | null | Manually set the locale for the react-datetime instance. Moment.js locale needs to be loaded to be used, see [i18n docs](#i18n).
| **onChange** | function | x => console.log(x) | Callback trigger when the date changes |
| **onBlur** | function | empty function | Callback trigger for when the user clicks outside of the input, simulating a regular onBlur |
| **viewMode** | string or number | 'days' | The default view to display when the picker is shown. ('years', 'months', 'days', 'time') |
| **inputProps** | object | undefined | Defines additional attributes for the input element of the component. |
| **minDate** | moment | undefined | The earliest date allowed for entry in the calendar view. |
| **maxDate** | moment | undefined | The latest date allowed for entry in the calendar view. |
| **renderDay** | function | DOM.td( day ) | Customize the way that the days are shown in the day picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component. See [appearance customization](#appearance_customization) |
| **renderMonth** | function | DOM.td( month ) | Customize the way that the months are shown in the month picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component. See [appearance customization](#appearance_customization) |
| **renderYear** | function | DOM.td( year ) | Customize the way that the years are shown in the year picker. The accepted function has the `selectedDate`, the current date and the default calculated `props` for the cell, and must return a React component. See [appearance customization](#appearance_customization) |

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
    renderDay: function( selectedDate, currentDate, props ){
        return <td {...props}>{ currentDate.date() }</td>;
    },
    renderMonth: function( selectedDate, currentMonthDate, props ){
        return <td {...props}>{ month }</td>;
    },
    renderDay: function( selectedDate, year, props ){
        return <td {...props}>{ currentDate.date() }</td>;
    }
});
```

* `props` is the object that react-date picker has calculated for this object. It is convenient to use this object as the props for your custom component, since it knows how to handle the click event and its `className` attribute is used by the default styles.
* `selectedDate` and `currentDate` are Moment.js objects and can be used to change the output depending on the selected date, or the date for the current day.
* `month` and `year` are the numeric representation of the current month and year to be displayed. Notice that the possible `month` values go from `0` to `11`.

Contributions
===============================
Any help is always welcome :)

### [MIT Licensed](LICENSE)
