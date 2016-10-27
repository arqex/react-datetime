Changelog
=========
## 2.6.2
* Update file references in `package.json`

## 2.6.1
* Added a source-map file.
* Fixed bug with invalid moment object.
* Decreased npm package size by ~29.3KB.

## 2.6.0
* Fixed hover styles for days
* Added multiple simultaneous datetime component support.
* `className` prop now supports string arrays
* Fixes 12:00am
* Removed warning for missing element keys.

## 2.5.0
* Added pre-commit hook for tests.
* Added the `timeConstraints` prop.

## 2.4.0
* Added ES linting.
* Added `closeOnTab` property.

## 2.3.3
* Updated readme.
* Fixed short months for not English locales.
* Fixed mixed 12 AM/PM.

## 2.3.2
* Time editor now handles the A format to display 12h times.

## 2.3.0
* Added typescript definition file.
* Changed button markup and updated styles.
* Fixes autoclosing on time change.

## 2.2.1
* Controlled datepicker now working for controlled datepickers

## 2.2.0
* The picker can be used as a month or year picker just giving a format date without days/months
* Updates test suite

## 2.1.0
* Fixed rdtActive not getting set.
* Add react-dom as external dependency.
* Fixed rendering a span directly under the calendar table.
* Added dev setup
* Added example

## 2.0.2
* Fixed january days go to november problem.

## 2.0.1
* Fixed two days can't have the same header name.

## 2.0.0
* DOM classes are now prefixed with `rdt`.
* A modified version of OnClickOutside is now included in the code to handle react 0.13 and 0.14 versions.
* Updated dependencies.

## 1.3.0
* Added open prop.
* Added strictParsing prop.
* Fixed not possible to set value to `''`.

## 1.2.1
* Removed classlist-polyfill so the component can be used in the server side.

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
