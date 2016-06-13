// Type definitions for react-datetime
// Project: https://github.com/YouCanBookMe/react-datetime
// Definitions by: Ivan Verevkin <vereva@x-root.org>

//// <reference path="../moment/moment-node.d.ts" />

declare module ReactDatetime {
  import React = __React;
  // import * as moment from 'moment';

  export interface DatetimepickerProps {
    /*
     Represents the selected date by the component, in order to use it as a controlled component.
     This prop is parsed by moment.js, so it is possible to use a date string or a moment.js date.
     */
    value?: string;
    /*
     Represents the selected date for the component to use it as a uncontrolled component.
     This prop is parsed by moment.js, so it is possible to use a date string or a moment.js date.
     */
    defaultValue?: string;
    /*
     Defines the format for the date. It accepts any moment.js date format.
     If true the date will be displayed using the defaults for the current locale.
     If false the datepicker is disabled and the component can be used as timepicker.
     */
    dateFormat?: boolean|string;
    /*
     Defines the format for the time. It accepts any moment.js time format.
     If true the time will be displayed using the defaults for the current locale.
     If false the timepicker is disabled and the component can be used as datepicker.
     */
    timeFormat?: boolean|string;
    /*
     Wether to show an input field to edit the date manually.
     */
    input?: boolean;
    /*
     Wether to open or close the picker. If not set react-datetime will open the
     datepicker on input focus and close it on click outside.
     */
    open?: boolean;
    /*
     Manually set the locale for the react-datetime instance.
     Moment.js locale needs to be loaded to be used, see i18n docs.
     */
    locale?: string;
    /*
     Callback trigger when the date changes. The callback receives the selected moment object as
     only parameter, if the date in the input is valid. If it isn't, the value
     of the input (a string) is returned.
     */
    onChange?:(x: string) => void;
    /*
     Callback trigger for when the user opens the datepicker.
     */
    onFocus?: (e) => void;
    /*
     Callback trigger for when the user clicks outside of the input, simulating a regular onBlur.
     The callback receives the selected moment object as only parameter, if the date in the
     input is valid. If it isn't, the value of the input (a string) is returned.
     */
    onBlurs?: (e) => void;
    /*
     The default view to display when the picker is shown. ('years', 'months', 'days', 'time')
     */
    viewMode?: string|number;
    /*
     Extra class names for the component markup.
     */
    className?: string;
    /*
     Defines additional attributes for the input element of the component.
     */
    inputProps?: Object;
    /*
     Define the dates that can be selected. The function receives (currentDate, selectedDate)
     and should return a true or false whether the currentDate is valid or not. See selectable dates.
     */
    isValidDate?: (x: string) => void;
    /*
     Customize the way that the days are shown in the day picker. The accepted function has
     the selectedDate, the current date and the default calculated props for the cell,
     and must return a React component. See appearance customization
     */
    renderDay?: (x: string) => void;
    /*
     Customize the way that the months are shown in the month picker.
     The accepted function has the selectedDate, the current date and the default calculated
     props for the cell, the month and the year to be shown, and must return a
     React component. See appearance customization
     */
    renderMonth?: (x: string) => void;
    /*
     Customize the way that the years are shown in the year picker.
     The accepted function has the selectedDate, the current date and the default calculated
     props for the cell, the year to be shown, and must return a React component.
     See appearance customization
     */
    renderYear?: (x: string) => void;
    /*
     Whether to use moment's strict parsing when parsing input.
     */
    strictParsing?: boolean;
    /*
     When true, once the day has been selected, the react-datetime will be automatically closed.
     */
    closeOnSelect?: boolean;
  }

  interface DatetimeComponent extends React.ComponentClass<DatetimepickerProps> {
  }
}

declare module "react-datetime" {
  var ReactDatetime: ReactDatetime.DatetimeComponent;
  export = ReactDatetime;
}
