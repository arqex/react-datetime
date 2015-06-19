react-datetime
===============================

This project is a port of https://github.com/Eonasdan/bootstrap-datetimepicker for React.js

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
See [Examples](examples/) for more details.

API
===============================

DateTimeField
========

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
