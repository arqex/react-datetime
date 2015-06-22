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
| **input** | boolean | true | Wether to show an input field to edit the date manually. |
| **locale** | string | null | Manually set the locale for the react-datetime instance. Moment.js locale needs to be loaded to be used, see [i18n docs](#i18n).
| **onChange** | function | x => console.log(x) | Callback trigger when the date changes |
| **viewMode** | string or number | 'days' | The default view to display when the picker is shown. ('years', 'months', 'days', 'time') |
| **inputProps** | object | undefined | Defines additional attributes for the input element of the component. |
| **minDate** | moment | undefined | The earliest date allowed for entry in the calendar view. |
| **maxDate** | moment | undefined | The latest date allowed for entry in the calendar view. |

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

Contributions
===============================
Any help is always welcome :)

### [MIT Licensed](LICENSE)
