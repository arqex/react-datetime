react-bootstrap-datetimepicker
===============================

This project is a port of https://github.com/Eonasdan/bootstrap-datetimepicker for React.js

Usage
===============================

Installation :
```
npm install react-bootstrap-datetimepicker
```

Then
```javascript
require('react-bootstrap-datetimepicker');

...

render: function() {
  return <DateTimeField />;
}
```
See [Examples](examples/README.md) for more details.

API
===============================

DateTimeField
========

| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **dateTime** | string  | "1234567" | Represents the inital dateTime, this string is then parsed by moment.js |
| **format**   | string  | "X"     | Defines the format moment.js should use to parse and output the date to onChange |
| **inputFormat** | string | "MM/DD/YY H:mm A" | Defines the way the date is represented in the HTML input |
| **onChange** | function | x => console.log(x) | Callback trigger when the date changes |
| **showToday** | boolean | true | Highlights today's date |
| **daysOfWeekDisabled** | array of integer | [] | Disables clicking on some days. Goes from 0 (Sunday) to 6 (Saturday). |


Contributions
===============================
There is still plenty of features missing compared to the original date time picker, hence contributions would be highly appreciated.
