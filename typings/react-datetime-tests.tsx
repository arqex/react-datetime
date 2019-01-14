import * as React from "react";
import { Moment } from "moment";
import * as moment from "moment";
import * as ReactDatetime from "react-datetime";

/*
 Test the datetime picker.
 */

const TEST_BASIC_USAGE: JSX.Element = <ReactDatetime />;

/*
 Test date properties
 */

const TEST_DATE_PROPS_FOR_VALUE: JSX.Element = <ReactDatetime
		value={ new Date() }
	/>;

const TEST_DATE_PROPS_FOR_DEFAULT_VALUE: JSX.Element = <ReactDatetime
		initialValue={ new Date() }
	/>;

const TEST_DATE_PROPS_FOR_VALUE_AS_MOMENT: JSX.Element = <ReactDatetime
		value={ moment() }
	/>;

const TEST_DATE_PROPS_FOR_VALUE_AS_STRING: JSX.Element = <ReactDatetime
		value={ '1995-12-25' }
	/>;

const TEST_DATE_PROPS_FOR_DEFAULT_VALUE_AS_MOMENT: JSX.Element = <ReactDatetime
		initialValue={ moment() }
	/>;

const TEST_DATE_PROPS_FOR_DEFAULT_VALUE_AS_STRING: JSX.Element = <ReactDatetime
		initialValue={ '1995-12-25' }
	/>;

/*
 Test formats
 */

const TEST_FORMAT_PROPS_AS_STRINGS: JSX.Element = <ReactDatetime
		dateFormat='mm/dd/yyyy'
		timeFormat='hh:mm:ss'
	/>;

const TEST_FORMAT_PROPS_AS_BOOLEANS: JSX.Element = <ReactDatetime
		dateFormat={ false }
		timeFormat={ false }
	/>;

/*
 Test boolean options
 */

const TEST_BOOLEAN_PROPS: JSX.Element = <ReactDatetime
		input={ false }
		open={ false }
		strictParsing={ false }
		closeOnSelect={ false }
		closeOnClickOutside={ false }
		utc={ false }
	/>;

/*
 Test locale options
 */

const TEST_LOCALE_PROPS: JSX.Element = <ReactDatetime
		locale='en-us'
	/>;

/*
 Test input props
 */

const TEST_INPUT_PROPS: JSX.Element = <ReactDatetime
		inputProps={
			{
				'placeholder': 'mm/dd/yyyy'
			}
		}
	/>;

/*
 Test Event handlers
 */

 const TEST_EVENT_HANDLERS_WITH_STRINGS: JSX.Element = <ReactDatetime
 		onChange={
 			(momentOrInputString:string) => {}
 		}
		onOpen={
			() => {}
		}
		onClose={
			(momentOrInputString:string) => {}
		}
		onNavigate={
 			(initialViewMode:string) => {}
		}
		onBeforeNavigate={
			(nextView:string, currentView:string, viewDate: any ) => { return 'ok' }
		}
 	/>;

const TEST_EVENT_HANDLERS_WITH_MOMENT: JSX.Element = <ReactDatetime
		onChange={
			(momentOrInputString:Moment) => {}
		}
		onClose={
			(momentOrInputString:Moment) => {}
		}
	/>;

/*
 Test view mode and className
 */

const TEST_VIEW_MODE_AND_CLASS_PROPS: JSX.Element = <ReactDatetime
		initialViewMode='days'
		className='rdt'
	/>;

/*
 Test date validator
 */

const TEST_DATE_VALIDATOR_PROP: JSX.Element = <ReactDatetime
		isValidDate={ (currentDate:any, selectedDate:any) => {
			return true;
		} }
	/>;

/*
 Test customizable components
 */

const TEST_CUSTOMIZABLE_COMPONENT_PROPS: JSX.Element = <ReactDatetime
		renderDay={ (props: any, currentDate: any, selectedDate: any) => {
			return <td {...props}>{ '0' + currentDate.date() }</td>;
		} }
		renderMonth={ (props: any, month: any, year: any, selectedDate: any) => {
			return <td {...props}>{ month }</td>;
		} }
		renderYear={ (props: any, year: any, selectedDate: any) => {
			return <td {...props}>{ year % 100 }</td>;
		} }
		renderInput={ (props: any, openCalendar: Function, closeCalendar: Function) => {
			return <input {...props} />
		}}
		renderView={ (viewMode: string, renderCalendar: Function ) => {
			return renderCalendar()
		}}
	/>;

/*
 Test time constraints.
 */

const TEST_BASIC_TIME_CONSTRAINTS: JSX.Element = <ReactDatetime
		timeConstraints={ {} }
	/>;

const TEST_TIME_CONSTRAINTS_WITH_ONE: JSX.Element = <ReactDatetime
		timeConstraints={ {
			'hours': {
				'min': 0,
				'max': 23,
				'step': 1
			}
		} }
	/>;

const TEST_TIME_CONSTRAINTS_WITH_ALL: JSX.Element = <ReactDatetime
		timeConstraints={ {
			'hours': {
				'min': 0,
				'max': 23,
				'step': 1
			},
			'minutes': {
				'min': 0,
				'max': 59,
				'step': 1
			},
			'seconds': {
				'min': 0,
				'max': 59,
				'step': 1,
			},
			'milliseconds': {
				'min': 0,
				'max': 999,
				'step': 1
			}
		} }
	/>;
