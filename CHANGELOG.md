Changelog
=========
## 1.1.1
* Updates react-onclickoutside dependency to avoid the bug https://github.com/Pomax/react-onclickoutside/issues/20

## 1.1.0
* Datepicker can have an empty value. If the value in the input is not valid, `onChange` and `onBlur` will return input value.
* `onBlur` is not triggered anymore if the calendar is not open.

## 1.0.0-rc.2
* Added travis CI
* Fixed not showing timepicker when `dateFormat`=`false`.

## 1.0.0-rc.1
This is the release candidate for this project. Now it is pretty usable and API won't change drastically in a while. If you were using the alpha versions (v0.x) there is a bunch of breaking changes:

* `date` prop is now called `defaultValue` and it is the initial value to use the component uncontrolled.
* `value` prop has been added to use it as a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components).
* Removed `minDate` and `maxDate` props. Now to define what dates are valid it is possible to use the new `isValidDate` prop.
* `dateFormat` and `timeFormat` default value is always the locale default format. In case that you don't want the component to show the date/time picker you should set `dateFormat`/`timeFormat` to `false`.

Moreover:
* Buttons doesn't submit anymore when the Datetime component is in a form.
* `className` prop has been added to customize component class.




