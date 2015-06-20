react-datetime
===============================
A date and time picker in the same React.js component. It can be used as a datepicker, timepicker or both at the same time.

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
| **dateFormat**   | string  | "MM/DD/YY"     | Defines the format moment.js should use to parse and output the date. The default is only set if there is not `timeFormat` defined. |
| **timeFormat**   | string  | "MM/DD/YY"     | Defines the format moment.js should use to parse and output the time. The default is only set if there is not `dateFormat` defined. |
| **onChange** | function | x => console.log(x) | Callback trigger when the date changes |
| **viewMode** | string or number | 'days' | The default view to display when the picker is shown. ('years', 'months', 'days', 'time') |
| **inputProps** | object | undefined | Defines additional attributes for the input element of the component. |
| **minDate** | moment | undefined | The earliest date allowed for entry in the calendar view. |
| **maxDate** | moment | undefined | The latest date allowed for entry in the calendar view. |

Contributions
===============================
Any help is always welcome :)

### [MIT Licensed](LICENSE)
