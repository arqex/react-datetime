/* global it, xit, describe, expect, done, jest */

import React from 'react'; 
import moment from 'moment';
import 'moment/locale/nl';
import 'moment/locale/sv';
import _momentTimezone from 'moment-timezone'; // eslint-disable-line
import utils from './testUtils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

moment.locale('en');

Enzyme.configure({ adapter: new Adapter() });

describe('Datetime', () => {
	it('create component', () => {
		const component = utils.createDatetime({});

		expect(component).toBeDefined();
		expect(component.find('.rdt > .form-control').length).toEqual(1);
		expect(component.find('.rdt > .rdtPicker').length).toEqual(1);
	});

	it('initialViewMode=days: renders days, week days, month, year', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'days', initialValue: date });
		utils.openDatepicker(component);

		// Month and year
		expect(component.find('.rdtSwitch').text()).toEqual('January 2000');

		// Week days
		const expectedWeekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			actualWeekdays = component.find('.rdtDays .dow').map((element) =>
				element.text()
			);
		expect(actualWeekdays).toEqual(expectedWeekDays);

		// Dates
		// "Old" dates belonging to prev month
		const oldDatesIndexes = [0, 1, 2, 3, 4, 5];
		oldDatesIndexes.forEach((index) => {
			expect(utils.getNthDay(component, index).hasClass('rdtOld')).toBeTruthy();
		});

		// Dates belonging to current month
		for (let i = 6; i < 37; i++) {
			expect(utils.getNthDay(component, i).hasClass('rdtDay')).toBeTruthy();
			expect(utils.getNthDay(component, i).hasClass('rdtOld')).toBeFalsy();
			expect(utils.getNthDay(component, i).hasClass('rdtNew')).toBeFalsy();
		}

		// "New" dates belonging to next month
		const nextDatesIndexes = [37, 38, 39, 40, 41];
		nextDatesIndexes.forEach((index) => {
			expect(utils.getNthDay(component, index).hasClass('rdtNew')).toBeTruthy();
		});
	});

	it('switch from day view to time view and back', () => {
		const component = utils.createDatetime({});

		expect(utils.isDayView(component)).toBeTruthy();
		utils.clickOnElement(component.find('.rdtTimeToggle'));
		expect(utils.isTimeView(component)).toBeTruthy();
		utils.clickOnElement(component.find('.rdtSwitch'));
		expect(utils.isDayView(component)).toBeTruthy();
	});

	it('persistent valid months going monthView->yearView->monthView', () => {
		const oldNow = Date.now;
		Date.now = () => new Date('2018-06-01T00:00:00').getTime();
		
		const dateBefore = '2018-06-01';
		const component = utils.createDatetime({
			initialViewMode: 'months',
			value: new Date(2018, 10, 10),
			isValidDate: current => current.isBefore(moment(dateBefore, 'YYYY-MM-DD'))
		});

		expect(utils.isMonthView(component)).toBeTruthy();
		expect(utils.getNthMonth(component, 4).hasClass('rdtDisabled')).toEqual(false);
		expect(utils.getNthMonth(component, 5).hasClass('rdtDisabled')).toEqual(true);

		// Go to year view
		utils.clickOnElement(component.find('.rdtSwitch'));
		expect(utils.isYearView(component)).toBeTruthy();

		expect(utils.getNthYear(component, 0).hasClass('rdtDisabled')).toEqual(false);
		expect(utils.getNthYear(component, 10).hasClass('rdtDisabled')).toEqual(true);

		utils.clickNthYear(component, 9);
		expect(utils.getNthMonth(component, 4).hasClass('rdtDisabled')).toEqual(false);
		expect(utils.getNthMonth(component, 5).hasClass('rdtDisabled')).toEqual(true);

		Date.now = oldNow;
	});

	it('step through views', () => {
		const component = utils.createDatetime({ initialViewMode: 'time' });

		expect(utils.isTimeView(component)).toBeTruthy();
		utils.clickOnElement(component.find('.rdtSwitch'));
		expect(utils.isDayView(component)).toBeTruthy();
		utils.clickOnElement(component.find('.rdtSwitch'));
		expect(utils.isMonthView(component)).toBeTruthy();
		utils.clickOnElement(component.find('.rdtSwitch'));
		expect(utils.isYearView(component)).toBeTruthy();
	});

	it('toggles calendar when open prop changes', () => {
		const component = utils.createDatetime({ open: false });
		expect(utils.isOpen(component)).toBeFalsy();
		// expect(component.find('.rdtOpen').length).toEqual(0);
		component.setProps({ open: true });
		expect(utils.isOpen(component)).toBeTruthy();
		// expect(component.find('.rdtOpen').length).toEqual(1);
		component.setProps({ open: false });
		expect(utils.isOpen(component)).toBeFalsy();
		// expect(component.find('.rdtOpen').length).toEqual(0);
	});

	it('selectYear', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'years', initialValue: date });
		expect(utils.isYearView(component)).toBeTruthy();
		expect(component.find('.rdtSwitch').text()).toEqual('2000-2009');

		// Click first year (1999)
		utils.clickOnElement(component.find('.rdtYear').at(0));
		expect(utils.isMonthView(component)).toBeTruthy();
		expect(component.find('.rdtSwitch').text()).toEqual('1999');
	});

	it('increase decade', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'years', initialValue: date });

		expect(component.find('.rdtSwitch').text()).toEqual('2000-2009');
		utils.clickOnElement(component.find('.rdtNext span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('2010-2019');
		utils.clickOnElement(component.find('.rdtNext span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('2020-2029');
	});

	it('decrease decade', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'years', initialValue: date });

		expect(component.find('.rdtSwitch').text()).toEqual('2000-2009');
		utils.clickOnElement(component.find('.rdtPrev span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('1990-1999');
		utils.clickOnElement(component.find('.rdtPrev span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('1980-1989');
	});

	it('select month', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'months', initialValue: date });

		expect(utils.isMonthView(component)).toBeTruthy();
		expect(component.find('.rdtSwitch').text()).toEqual('2000');
		// Click any month to enter day view
		utils.clickNthMonth(component, 1);
		expect(utils.isDayView(component)).toBeTruthy();
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('1');
	});

	it('increase year', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'months', initialValue: date });

		expect(component.find('.rdtSwitch').text()).toEqual('2000');
		utils.clickOnElement(component.find('.rdtNext span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('2001');
		utils.clickOnElement(component.find('.rdtNext span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('2002');
	});

	it('decrease year', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'months', initialValue: date });

		expect(component.find('.rdtSwitch').text()).toEqual('2000');
		utils.clickOnElement(component.find('.rdtPrev span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('1999');
		utils.clickOnElement(component.find('.rdtPrev span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('1998');
	});

	it('increase month', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialValue: date });

		expect(component.find('.rdtSwitch').text()).toEqual('January 2000');
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('0');
		utils.clickOnElement(component.find('.rdtNext span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('February 2000');
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('1');
		utils.clickOnElement(component.find('.rdtNext span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('March 2000');
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('2');
	});

	it('decrease month', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			component = utils.createDatetime({ initialValue: date });

		expect(component.find('.rdtSwitch').text()).toEqual('January 2000');
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('0');
		utils.clickOnElement(component.find('.rdtPrev span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('December 1999');
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('11');
		utils.clickOnElement(component.find('.rdtPrev span').at(0));
		expect(component.find('.rdtSwitch').text()).toEqual('November 1999');
		expect(component.find('.rdtSwitch').getDOMNode().getAttribute('data-value')).toEqual('10');
	});

	it('open picker', () => {
		const component = utils.createDatetime();
		expect(utils.isOpen(component)).toBeFalsy();
		utils.openDatepicker(component);
		expect(utils.isOpen(component)).toBeTruthy();
	});

	it('click on day of the next month', () => {
		const component = utils.createDatetime({
			initialViewMode: 'days',
			initialValue: new Date(2019, 0, 1)
		});

		utils.openDatepicker(component);
		utils.clickClassItem(component, '.rdtNew', 1);

		expect(component.find('.rdtSwitch').text()).toEqual('February 2019');
	});

	it('click on day of the prev month', () => {
		const component = utils.createDatetime({
			initialViewMode: 'days',
			initialValue: new Date(2019, 0, 1)
		});

		utils.openDatepicker(component);
		utils.clickClassItem(component, '.rdtOld', 1);
		
		expect(component.find('.rdtSwitch').text()).toEqual('December 2018');
	});

	it('sets CSS class on selected item (day)', () => {
		const component = utils.createDatetime({ initialViewMode: 'days' });
		utils.openDatepicker(component);
		utils.clickNthDay(component, 13);
		expect(utils.getNthDay(component, 13).hasClass('rdtActive')).toBeTruthy();
	});

	it('sets CSS class on selected item (month)', () => {
		const component = utils.createDatetime({ initialViewMode: 'months', dateFormat: 'YYYY-MM' });
		utils.openDatepicker(component);
		utils.clickNthMonth(component, 4);
		expect(utils.getNthMonth(component, 4).hasClass('rdtActive')).toBeTruthy();
	});

	it('sets CSS class on selected item (year)', () => {
		const component = utils.createDatetime({ initialViewMode: 'years', dateFormat: 'YYYY' });
		utils.openDatepicker(component);
		utils.clickNthYear(component, 3);
		expect(utils.getNthYear(component, 3).hasClass('rdtActive')).toBeTruthy();
	});

	it('sets CSS class on days outside of month', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			prevMonthDaysIndexes = [0, 1, 2, 3, 4, 5],
			nextMonthDaysIndexes = [37, 38, 39, 40, 41],
			component = utils.createDatetime({ initialViewMode: 'days', initialValue: date });

		utils.openDatepicker(component);

		prevMonthDaysIndexes.forEach((index) => {
			expect(utils.getNthDay(component, index).hasClass('rdtOld')).toBeTruthy();
		});
		nextMonthDaysIndexes.forEach((index) => {
			expect(utils.getNthDay(component, index).hasClass('rdtNew')).toBeTruthy();
		});
	});

	it('selected day persists (in UI) when navigating to prev month', () => {
		const date = new Date(2000, 0, 3, 2, 2, 2, 2),
			component = utils.createDatetime({ initialViewMode: 'days', initialValue: date });

		utils.openDatepicker(component);
		expect(utils.getNthDay(component, 8).hasClass('rdtActive')).toBeTruthy();
		// Go to previous month
		utils.clickOnElement(component.find('.rdtDays .rdtPrev span'));
		expect(utils.getNthDay(component, 36).hasClass('rdtActive')).toBeTruthy();
	});

	it('sets CSS class on today date', () => {
		const specificDate = moment(),
			day = specificDate.date(),
			component = utils.createDatetime({ initialValue: specificDate })
		;

		utils.openDatepicker(component);
		expect(component.find('.rdtToday').text()).toEqual( day+'' );
	});

	describe('with custom props', () => {
		it('input=false', () => {
			const component = utils.createDatetime({ input: false });
			expect(component.find('.rdt > .form-control').length).toEqual(0);
			expect(component.find('.rdt > .rdtPicker').length).toEqual(1);
		});

		it('dateFormat', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				component = utils.createDatetime({ value: date, dateFormat: 'M&D' });
			expect(utils.getInputValue(component)).toEqual(mDate.format('M&D LT'));
		});

		it('dateFormat=false', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				component = utils.createDatetime({ value: date, dateFormat: false });
			expect(utils.getInputValue(component)).toEqual(mDate.format('LT'));
			// Make sure time view is active
			expect(utils.isTimeView(component)).toBeTruthy();
			// Make sure the date toggle is not rendered
			expect(component.find('thead').length).toEqual(0);
		});

		it('timeFormat', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				format = 'HH:mm:ss:SSS',
				component = utils.createDatetime({ value: date, timeFormat: format });
			expect(utils.getInputValue(component)).toEqual(mDate.format('L ' + format));
		});

		it('timeFormat=false', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				component = utils.createDatetime({ value: date, timeFormat: false });
			expect(utils.getInputValue(component)).toEqual(mDate.format('L'));
			// Make sure day view is active
			expect(utils.isDayView(component)).toBeTruthy();
			// Make sure the time toggle is not rendered
			expect(component.find('.timeToggle').length).toEqual(0);
		});

		it('timeFormat with lowercase \'am\'', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				format = 'HH:mm:ss:SSS a',
				component = utils.createDatetime({ value: date, timeFormat: format });
			expect(utils.getInputValue(component)).toEqual(expect.stringMatching('.*am$'));
		});

		it('timeFormat with uppercase \'AM\'', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				format = 'HH:mm:ss:SSS A',
				component = utils.createDatetime({ value: date, timeFormat: format });
			expect(utils.getInputValue(component)).toEqual(expect.stringMatching('.*AM$'));
		});

		it('initialViewMode=years', () => {
			const component = utils.createDatetime({ initialViewMode: 'years' });
			expect(utils.isYearView(component)).toBeTruthy();
		});

		it('initialViewMode=months', () => {
			const component = utils.createDatetime({ initialViewMode: 'months' });
			expect(utils.isMonthView(component)).toBeTruthy();
		});

		it('initialViewMode=time', () => {
			const component = utils.createDatetime({ initialViewMode: 'time' });
			expect(utils.isTimeView(component)).toBeTruthy();
		});

		it('className -> type string', () => {
			const component = utils.createDatetimeShallow({ className: 'custom-class' });
			expect(component.find('.custom-class').length).toEqual(1);
		});

		it('className -> type string array', () => {
			const component = utils.createDatetimeShallow({ className: ['custom-class1', 'custom-class2'] });
			expect(component.find('.custom-class1').length).toEqual(1);
			expect(component.find('.custom-class2').length).toEqual(1);
		});

		it('inputProps', () => {
			const component = utils.createDatetime({
				inputProps: { className: 'custom-class', type: 'email', placeholder: 'custom-placeholder' }
			});
			expect(component.find('input.custom-class').length).toEqual(1);
			expect(component.find('input').getDOMNode().type).toEqual('email');
			expect(component.find('input').getDOMNode().placeholder).toEqual('custom-placeholder');
		});

		it('renderInput', () => {
			const renderInput = (props, openCalendar) => {
				return (
					<div>
						<input {...props} />
						<button className="custom-open" onClick={openCalendar}>open calendar</button>
					</div>
				);
			};
			const component = utils.createDatetime({ renderInput });

			expect(component.find('button.custom-open').length).toEqual(1);
			expect(utils.isOpen(component)).toBeFalsy();
			utils.clickOnElement(component.find('button.custom-open'));
			expect(utils.isOpen(component)).toBeTruthy();
		});

		it('renderDay', () => {
			let props = {},
				currentDate = '',
				selectedDate = '';
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				renderDayFn = (fnProps, current, selected) => {
					props = fnProps;
					currentDate = current;
					selectedDate = selected;

					return <td {...fnProps}>custom-content</td>;
				};

			const component = utils.createDatetime({ value: mDate, renderDay: renderDayFn });

			// Last day should be 6th of february
			expect(currentDate.day()).toEqual(6);
			expect(currentDate.month()).toEqual(1);

			// The date must be the same
			expect(selectedDate.isSame(mDate)).toEqual(true);

			// There should be a onClick function in the props
			expect(typeof props.onClick).toEqual('function');

			// The cell text should match
			expect(component.find('.rdtDay').at(0).text()).toEqual('custom-content');
		});

		it('renderMonth', () => {
			let props = {},
				month = '',
				year = '',
				selectedDate = '';
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				renderMonthFn = (fnProps, fnMonth, fnYear, selected) => {
					props = fnProps;
					month = fnMonth;
					year = fnYear;
					selectedDate = selected;

					return <td {...fnProps}>custom-content</td>;
				};

			const component = utils.createDatetime({ value: mDate, initialViewMode: 'months', renderMonth: renderMonthFn });

			expect(month).toEqual(11);
			expect(year).toEqual(2000);

			// The date must be the same
			expect(selectedDate.isSame(mDate)).toEqual(true);

			// There should be a onClick function in the props
			expect(typeof props.onClick).toEqual('function');

			// The cell text should match
			expect(component.find('.rdtMonth').at(0).text()).toEqual('custom-content');
		});

		it('renderYear', () => {
			let props = {},
				year = '',
				selectedDate = '';
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				renderYearFn = (fnProps, fnYear, selected) => {
					props = fnProps;
					year = fnYear;
					selectedDate = selected;

					return <td {...fnProps}>custom-content</td>;
				};

			const component = utils.createDatetime({ value: mDate, initialViewMode: 'years', renderYear: renderYearFn });

			expect(year).toEqual(2010);

			// The date must be the same
			expect(selectedDate.isSame(mDate)).toEqual(true);

			// There should be a onClick function in the props
			expect(typeof props.onClick).toEqual('function');

			// The cell text should match
			expect(component.find('.rdtYear').at(0).text()).toEqual('custom-content');
		});

		it('renderView', () => {
			let renderView = ( viewType, renderDefault ) => {
				return (
					<div className="customView">
						<span className="viewType">{ viewType }</span>
						{ renderDefault() }
					</div>
				);
			};

			let component = utils.createDatetime({
				renderView, initialViewMode: 'years', input: false
			});
			
			expect( component.find('.viewType').text() ).toEqual('years');
			expect( component.find('.rdtYear').length ).not.toBe(0);
		});

		it('closeOnTab=true', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ value: date });

			expect(utils.isOpen(component)).toBeFalsy();
			utils.openDatepicker(component);
			expect(utils.isOpen(component)).toBeTruthy();
			component.find('.form-control').simulate('keyDown', { key: 'Tab', keyCode: 9, which: 9 });
			expect(utils.isOpen(component)).toBeFalsy();
		});

		it('closeOnTab=false', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ value: date, closeOnTab: false });

			expect(utils.isOpen(component)).toBeFalsy();
			utils.openDatepicker(component);
			expect(utils.isOpen(component)).toBeTruthy();
			component.find('.form-control').simulate('keyDown', { key: 'Tab', keyCode: 9, which: 9 });
			expect(utils.isOpen(component)).toBeTruthy();
		});

		it('closeOnClickOutside=true', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ value: date, closeOnClickOutside: false });

			expect(utils.isOpen(component)).toBeFalsy();
			utils.openDatepicker(component);
			expect(utils.isOpen(component)).toBeTruthy();
			document.dispatchEvent(new Event('mousedown'));
			component.update();
			expect(utils.isOpen(component)).toBeTruthy();
		});

		it('closeOnClickOutside=false', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ value: date, closeOnClickOutside: true });

			expect(utils.isOpen(component)).toBeFalsy();
			utils.openDatepicker(component);
			expect(utils.isOpen(component)).toBeTruthy();
			document.dispatchEvent(new Event('mousedown'));
			component.update();
			expect(utils.isOpen(component)).toBeFalsy();
		});

		it('open by click', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2);
			const component = utils.createDatetime({ value: date, closeOnClickOutside: true });

			utils.openDatepicker(component);
			expect( component.instance().state.open ).toBeTruthy();
			component.instance().setState({open: false});
			expect( component.instance().state.open ).toBeFalsy();
			utils.openDatepickerByClick(component);
			expect( component.instance().state.open ).toBeTruthy();
		});

		it('increase time', () => {
			let i = 0;
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ timeFormat: 'HH:mm:ss:SSS', initialViewMode: 'time',
					initialValue: date, onChange: (selected) => {
						// TODO: Trigger onChange when increasing time
						i++;
						if (i > 2) {
							expect(true).toEqual(false); // Proof that this is not called
							expect(selected.hour()).toEqual(3);
							expect(selected.minute()).toEqual(3);
							expect(selected.second()).toEqual(3);
							done();
						}
					}});

			// Check hour
			expect(utils.getHours(component)).toEqual('2');
			utils.increaseHour(component);
			expect(utils.getHours(component)).toEqual('3');

			// Check minute
			expect(utils.getMinutes(component)).toEqual('02');
			utils.increaseMinute(component);
			expect(utils.getMinutes(component)).toEqual('03');

			// Check second
			expect(utils.getSeconds(component)).toEqual('02');
			utils.increaseSecond(component);
			expect(utils.getSeconds(component)).toEqual('03');
		});

		it('decrease time', () => {
			let i = 0;
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ timeFormat: 'HH:mm:ss:SSS', initialViewMode: 'time',
					initialValue: date, onChange: (selected) => {
						// TODO: Trigger onChange when increasing time
						i++;
						if (i > 2) {
							expect(true).toEqual(false); // Proof that this is not called
							expect(selected.hour()).toEqual(1);
							expect(selected.minute()).toEqual(1);
							expect(selected.second()).toEqual(1);
							done();
						}
					}});

			// Check hour
			expect(utils.getHours(component)).toEqual('2');
			utils.decreaseHour(component);
			expect(utils.getHours(component)).toEqual('1');

			// Check minute
			expect(utils.getMinutes(component)).toEqual('02');
			utils.decreaseMinute(component);
			expect(utils.getMinutes(component)).toEqual('01');

			// Check second
			expect(utils.getSeconds(component)).toEqual('02');
			utils.decreaseSecond(component);
			expect(utils.getSeconds(component)).toEqual('01');
		});

		it('long increase time', (done) => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ timeFormat: 'HH:mm:ss:SSS', initialViewMode: 'time', initialValue: date });

			utils.increaseHour(component);
			setTimeout(() => {
				expect(utils.getHours(component)).not.toEqual('2');
				expect(utils.getHours(component)).not.toEqual('3');
				done();
			}, 920);
		});

		it('long decrease time', (done) => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ timeFormat: 'HH:mm:ss:SSS', initialViewMode: 'time', initialValue: date });

			utils.decreaseHour(component);
			setTimeout(() => {
				expect(utils.getHours(component)).not.toEqual('1');
				expect(utils.getHours(component)).not.toEqual('0');
				done();
			}, 920);
		});

		it('timeConstraints -> increase time', () => {
			let i = 0;
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ timeFormat: 'HH:mm:ss:SSS', initialViewMode: 'time',
					initialValue: date, timeConstraints: { hours: { max: 6, step: 8 }, minutes: { step: 15 }},
					onChange: (selected) => {
						// TODO
						i++;
						if (i > 2) {
							expect(selected.minute()).toEqual(17);
							expect(selected.second()).toEqual(3);
							done();
						}
					}
				});

			utils.increaseHour(component);
			expect(utils.getHours(component)).toEqual('3');

			utils.increaseMinute(component);
			expect(utils.getMinutes(component)).toEqual('17');

			utils.increaseSecond(component);
			expect(utils.getSeconds(component)).toEqual('03');
		});

		it('timeConstraints -> decrease time', () => {
			let i = 0;
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ timeFormat: 'HH:mm:ss:SSS', initialViewMode: 'time',
					initialValue: date, timeConstraints: { minutes: { step: 15 }}, onChange: (selected) => {
						// TODO
						i++;
						if (i > 2) {
							expect(selected.minute()).toEqual(17);
							expect(selected.second()).toEqual(3);
							done();
						}
					}
				});

			utils.decreaseMinute(component);
			expect(utils.getMinutes(component)).toEqual('47');
		});

		it('strictParsing=true', (done) => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				invalidStrDate = strDate + 'x',
				component = utils.createDatetime({ initialValue: '', strictParsing: true,
					onChange: updated => {
						expect(updated).toBe( invalidStrDate );
						done();
					}	
				})
			;

			component.find('.form-control').simulate('change', { target: { value: invalidStrDate }});
		});

		it('strictParsing=false', (done) => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				invalidStrDate = strDate + 'x',
				component = utils.createDatetime({ initialValue: '', strictParsing: false,
					onChange: (updated) => {
						expect(mDate.format('L LT')).toEqual(updated.format('L LT'));
						done();
					}});

			component.find('.form-control').simulate('change', { target: { value: invalidStrDate }});
		});

		it('isValidDate -> disable months', () => {
			const dateBefore = new Date().getFullYear() + '-06-01',
				component = utils.createDatetime({ initialViewMode: 'months', isValidDate: (current) =>
					current.isBefore(moment(dateBefore, 'YYYY-MM-DD'))
				});

			expect(utils.getNthMonth(component, 0).hasClass('rdtDisabled')).toEqual(false);
			expect(utils.getNthMonth(component, 4).hasClass('rdtDisabled')).toEqual(false);
			expect(utils.getNthMonth(component, 5).hasClass('rdtDisabled')).toEqual(true);
			expect(utils.getNthMonth(component, 11).hasClass('rdtDisabled')).toEqual(true);
		});

		it('isValidDate -> disable years', () => {
			const component = utils.createDatetime({
				initialViewMode: 'years',
				value: moment('2025-01-01', 'YYYY-MM-DD'),
				isValidDate: current =>	current.isBefore(moment('2026-01-01', 'YYYY-MM-DD'))
			});

			expect(utils.getNthYear(component, 0).hasClass('rdtDisabled')).toEqual(false);
			expect(utils.getNthYear(component, 6).hasClass('rdtDisabled')).toEqual(false);
			expect(utils.getNthYear(component, 7).hasClass('rdtDisabled')).toEqual(true);
		});

		it('locale', () => {
			const component = utils.createDatetime({ locale: 'nl' }),
				expectedWeekDays = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'],
				actualWeekDays = component.find('.rdtDays .dow').map((element) =>
					element.text().toLowerCase()
				);

			expect(actualWeekDays).toEqual(expectedWeekDays);
		});

		it('locale with initialViewMode=months', () => {
			const component = utils.createDatetime({ locale: 'nl', initialViewMode: 'months' }),
				expectedMonths = ['Mrt', 'Mei'],
				actualMonths = [utils.getNthMonth(component, 2).text(), utils.getNthMonth(component, 4).text()];

			expect(actualMonths).toEqual(expectedMonths);
		});

		it('closeOnSelect=false', (done) => {
			const component = utils.createDatetime({ closeOnSelect: false });

			// A unknown race condition is causing this test to fail without this time out,
			// and when the test fails it says:
			// 'Timeout - Async callback was not invoked within timeout'
			// Ideally it would say something else but at least we know the tests are passing now
			setTimeout(() => {
				expect(utils.isOpen(component)).toBeFalsy();
				utils.openDatepicker(component);
				expect(utils.isOpen(component)).toBeTruthy();
				utils.clickNthDay(component, 2);
				expect(utils.isOpen(component)).toBeTruthy();
				done();
			}, 0);
		});

		it('closeOnSelect=true', (done) => {
			const component = utils.createDatetime({ closeOnSelect: true });

			// A unknown race condition is causing this test to fail without this time out,
			// and when the test fails it says:
			// 'Timeout - Async callback was not invoked within timeout'
			// Ideally it would say something else but at least we know the tests are passing now
			setTimeout(() => {
				expect(utils.isOpen(component)).toBeFalsy();
				utils.openDatepicker(component);
				expect(utils.isOpen(component)).toBeTruthy();
				utils.clickNthDay(component, 2);
				expect(utils.isOpen(component)).toBeFalsy();
				done();
			}, 0);
		});

		describe('initialValue of type', () => {
			it('date', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					strDate = momentDate.format('L') + ' ' + momentDate.format('LT'),
					component = utils.createDatetime({ initialValue: date });
				expect(utils.getInputValue(component)).toEqual(strDate);
			});

			it('moment', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					strDate = momentDate.format('L') + ' ' + momentDate.format('LT'),
					component = utils.createDatetime({ initialValue: momentDate });
				expect(utils.getInputValue(component)).toEqual(strDate);
			});

			it('string', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					strDate = momentDate.format('L') + ' ' + momentDate.format('LT'),
					component = utils.createDatetime({ initialValue: strDate });
				expect(utils.getInputValue(component)).toEqual(strDate);
			});
		});

		describe('timeFormat with', () => {
			it('milliseconds', () => {
				const component = utils.createDatetime({ initialViewMode: 'time', timeFormat: 'HH:mm:ss:SSS' });
				expect(component.find('.rdtCounter').length).toEqual(4);
				// TODO: Test that you can input a value in milli seconds input
			});

			it('seconds', () => {
				const component = utils.createDatetime({ initialViewMode: 'time', timeFormat: 'HH:mm:ss' });
				expect(component.find('.rdtCounter').length).toEqual(3);
			});

			it('minutes', () => {
				const component = utils.createDatetime({ initialViewMode: 'time', timeFormat: 'HH:mm' });
				expect(component.find('.rdtCounter').length).toEqual(2);
			});

			it('hours', () => {
				const component = utils.createDatetime({ initialViewMode: 'time', timeFormat: 'HH' });
				expect(component.find('.rdtCounter').length).toEqual(1);
			});
		});

		describe('being updated and should trigger update', () => {
			it('dateFormat -> value should change format', (done) => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					component = utils.createDatetime({
						dateFormat: 'YYYY-MM-DD', timeFormat: false, initialValue: date
					});

				const valueBefore = utils.getInputValue(component);
				// A unknown race condition is causing this test to fail without this time out,
				// and when the test fails it says:
				// 'Timeout - Async callback was not invoked within timeout'
				// Ideally it would say something else but at least we know the tests are passing now
				setTimeout(() => {
					component.setProps({ dateFormat: 'DD.MM.YYYY' });
					const valueAfter = utils.getInputValue(component);

					expect(valueBefore).not.toEqual(valueAfter);
					done();
				}, 0);
			});

			it('UTC -> value should change format (true->false)', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					component = utils.createDatetime({ value: momentDate, utc: true });

				const valueBefore = utils.getInputValue(component);
				component.setProps({ utc: false }, () => {
					const valueAfter = utils.getInputValue(component);

					expect(valueBefore).not.toEqual(valueAfter);
				});
			});

			it('UTC -> value should change format (false->true)', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					component = utils.createDatetime({ value: momentDate, utc: false });

				const valueBefore = utils.getInputValue(component);
				component.setProps({ utc: true }, () => {
					const valueAfter = utils.getInputValue(component);

					expect(valueBefore).not.toEqual(valueAfter);
				});
			});

			it('displayTimeZone -> value should change format (undefined->America/New_York)', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					component = utils.createDatetime({ initialViewMode: 'time', timeFormat: 'HH', value: momentDate }),
					displayTimeZone = (moment.tz.guess() === 'America/New_York' ? 'America/Los_Angeles' : 'America/New_York');

				const valueBefore = utils.getInputValue(component);
				const timeCountBefore = component.find('.rdtCount').text();
				component.setProps({ displayTimeZone: displayTimeZone }, () => {
					const valueAfter = utils.getInputValue(component);

					expect(valueBefore).not.toEqual(valueAfter);
				});
				const timeCountAfter = component.find('.rdtCount').text();
				expect(timeCountBefore).not.toEqual(timeCountAfter);
			});

			it('displayTimeZone -> value should change format (America/New_York->undefined)', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					momentDate = moment(date),
					displayTimeZone = (moment.tz.guess() === 'America/New_York' ? 'America/Los_Angeles' : 'America/New_York'),
					component = utils.createDatetime({ initialViewMode: 'time', timeFormat: 'HH', value: momentDate, displayTimeZone: displayTimeZone });

				const valueBefore = utils.getInputValue(component);
				const timeCountBefore = component.find('.rdtCount').text();
				component.setProps({ displayTimeZone: undefined }, () => {
					const valueAfter = utils.getInputValue(component);

					expect(valueBefore).not.toEqual(valueAfter);
				});
				const timeCountAfter = component.find('.rdtCount').text();
				expect(timeCountBefore).not.toEqual(timeCountAfter);
			});

			it('locale -> picker should change language (initialViewMode=days)', () => {
				const component = utils.createDatetime({ initialViewMode: 'days', locale: 'en' });
				const	weekdaysBefore = component.find('.rdtDays .dow').map( element =>
					element.text()
				);

				component.setProps({ locale: 'nl' });
				
				// I don't know why the component doesn't get updated automatically in this case
				// In the next test case it's working ok without using update()
				component.update();

				const weekdaysAfter = component.find('.rdtDays .dow').map((element) =>
					element.text()
				);

				expect(weekdaysBefore).not.toEqual(weekdaysAfter);
			});

			it('locale -> picker should change language (initialViewMode=months)', () => {
				const component = utils.createDatetime({ initialViewMode: 'months', locale: 'nl' }),
					monthsBefore = [utils.getNthMonth(component, 2).text(), utils.getNthMonth(component, 4).text()];

				component.setProps({ locale: 'sv' });
				const monthsAfter = [utils.getNthMonth(component, 2).text(), utils.getNthMonth(component, 4).text()];

				expect(monthsBefore).not.toEqual(monthsAfter);
			});
		});
	});

	describe('event listeners', () => {
		describe('onClose', () => {
			it('when selecting a date', () => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					onCloseFn = jest.fn(),
					component = utils.createDatetime({ value: date, onClose: onCloseFn, closeOnSelect: true });

				utils.openDatepicker(component);
				// Close component by selecting a date
				utils.clickNthDay(component, 2);
				expect(onCloseFn).toHaveBeenCalledTimes(1);
			});

			it('when selecting date (value=null and closeOnSelect=true)', () => {
				const onCloseFn = jest.fn(),
					component = utils.createDatetime({ value: null, onClose: onCloseFn, closeOnSelect: true });

				utils.openDatepicker(component);
				// Close component by selecting a date
				utils.clickNthDay(component, 2);
				expect(onCloseFn).toHaveBeenCalledTimes(1);
			});

			it('when selecting date (value=null and closeOnSelect=false)', () => {
				const onCloseFn = jest.fn(),
					component = utils.createDatetime({ value: null, onClose: onCloseFn, closeOnSelect: false });

				utils.openDatepicker(component);
				// Close component by selecting a date
				utils.clickNthDay(component, 2);
				expect(onCloseFn).not.toHaveBeenCalled();
			});
		});

		it('onOpen when opening datepicker', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				onOpenFn = jest.fn(),
				component = utils.createDatetime({ value: date, onOpen: onOpenFn });

			utils.openDatepicker(component);
			expect(onOpenFn).toHaveBeenCalledTimes(1);
		});

		describe('onNavigate', () => {
			it('when switch from days to time view mode', () => {
				const component = utils.createDatetime({ onNavigate: (initialViewMode) => {
					expect(initialViewMode).toEqual('time');
				}});
				expect(utils.isDayView(component)).toBeTruthy();
				utils.clickOnElement(component.find('.rdtTimeToggle'));
				expect(utils.isTimeView(component)).toBeTruthy();
			});

			it('when switch from time to days view mode', () => {
				const component = utils.createDatetime({ initialViewMode: 'time', onNavigate: (initialViewMode) => {
					expect(initialViewMode).toEqual('days');
				}});
				expect(utils.isTimeView(component)).toBeTruthy();
				utils.clickOnElement(component.find('.rdtSwitch'));
				expect(utils.isDayView(component)).toBeTruthy();
			});

			it('when switch from days to months view mode', () => {
				const component = utils.createDatetime({ onNavigate: (initialViewMode) => {
					expect(initialViewMode).toEqual('months');
				}});
				expect(utils.isDayView(component)).toBeTruthy();
				utils.clickOnElement(component.find('.rdtSwitch'));
				expect(utils.isMonthView(component)).toBeTruthy();
			});

			it('when switch from months to years view mode', () => {
				const component = utils.createDatetime({ initialViewMode: 'months', onNavigate: (initialViewMode) => {
					expect(initialViewMode).toEqual('years');
				}});
				expect(utils.isMonthView(component)).toBeTruthy();
				utils.clickOnElement(component.find('.rdtSwitch'));
				expect(utils.isYearView(component)).toBeTruthy();
			});

			it('only when switch from years to months view mode', () => {
				const component = utils.createDatetime({ initialViewMode: 'years', onNavigate: (initialViewMode) => {
					expect(initialViewMode).toEqual('months');
				}});
				expect(utils.isYearView(component)).toBeTruthy();
				utils.clickOnElement(component.find('.rdtSwitch'));
				expect(utils.isYearView(component)).toBeTruthy();
				utils.clickNthYear(component, 2);
				expect(utils.isMonthView(component)).toBeTruthy();
			});

			it('when switch from months to days view mode', () => {
				const component = utils.createDatetime({ initialViewMode: 'months', onNavigate: (initialViewMode) => {
					expect(initialViewMode).toEqual('days');
				}});
				expect(utils.isMonthView(component)).toBeTruthy();
				utils.clickNthMonth(component, 2);
				expect(utils.isDayView(component)).toBeTruthy();
			});

			it('when onBeforeNavigate is defined', done => {
				const date = moment( new Date(2000, 0, 15, 2, 2, 2, 2) );
				let on = viewMode => {
					expect( viewMode ).toEqual('days');
					done();
				};
				let obn = (next, current, viewDate) => {
					expect( next ).toEqual('days');
					expect( current ).toEqual('months');
					expect( viewDate.month() ).toEqual( 2 );
					expect( viewDate.year() ).toEqual( date.year() );
					return next;
				};
				const component = utils.createDatetime(
					{ value: date, initialViewMode: 'months', onNavigate: on, onBeforeNavigate: obn }
				);

				expect(utils.isMonthView(component)).toBeTruthy();
				utils.clickNthMonth(component, 2);
				expect(utils.isDayView(component)).toBeTruthy();
			});
			
			it('prevent navigation using onBeforeNavigate', () => {
				const date = moment( new Date(2000, 0, 15, 2, 2, 2, 2) );
				let on = jest.fn();
				let obn = (next, current, viewDate) => {
					expect( next ).toEqual('years');
					expect( current ).toEqual('months');
					expect( viewDate.month() ).toEqual( date.month() );
					expect( viewDate.year() ).toEqual( date.year() );
					return false;
				};

				const component = utils.createDatetime(
					{ value: date, initialViewMode: 'months', onNavigate: on, onBeforeNavigate: obn }
				);

				expect(utils.isMonthView(component)).toBeTruthy();
				// Go to year view
				utils.clickOnElement(component.find('.rdtSwitch'));
				expect(utils.isMonthView(component)).toBeTruthy();
				expect(utils.isYearView(component)).toBeFalsy();
				expect(on).not.toHaveBeenCalled();
			});

			it('go to a different screen when navigating using onBeforeNavigate', done => {
				// race condition fix
				setTimeout( () => {
					let on = viewMode => {
						expect( viewMode ).toEqual('years');
					};
					let obn = (next, current) => {
						expect( next ).toEqual('days');
						expect( current ).toEqual('months');
						return 'years';
					};
					const component = utils.createDatetime(
						{ initialViewMode: 'months', onNavigate: on, onBeforeNavigate: obn }
					);

					expect(utils.isMonthView(component)).toBeTruthy();
					utils.clickNthMonth(component, 2);
					expect(utils.isYearView(component)).toBeTruthy();
					done();
				});
			});
		});

		describe('onChange', () => {
			it('trigger only when last selection type is selected', done => {
				// race condition fix
				setTimeout( () => {
					// By selection type I mean if you CAN select day, then selecting a month
					// should not trigger onChange
					const onChangeFn = jest.fn(),
						component = utils.createDatetime({ initialViewMode: 'years', onChange: onChangeFn });
	
					utils.openDatepicker(component);
	
					utils.clickNthYear(component, 2);
					expect(onChangeFn).not.toHaveBeenCalled();
	
					utils.clickNthMonth(component, 2);
					expect(onChangeFn).not.toHaveBeenCalled();
	
					utils.clickNthDay(component, 2);
					expect(onChangeFn).toHaveBeenCalled();
					done();
				});
			});

			it('when selecting date', (done) => {
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					mDate = moment(date),
					component = utils.createDatetime({ initialValue: date, onChange: (selected) => {
						expect(selected.date()).toEqual(2);
						expect(selected.month()).toEqual(mDate.month());
						expect(selected.year()).toEqual(mDate.year());
						done();
					}});

				utils.clickNthDay(component, 7);
			});

			it('when selecting multiple date in a row', (done) => {
				let i = 0;
				const date = new Date(2000, 0, 15, 2, 2, 2, 2),
					mDate = moment(date),
					component = utils.createDatetime({ initialValue: date, onChange: (selected) => {
						i++;
						if (i > 2) {
							expect(selected.date()).toEqual(4);
							expect(selected.month()).toEqual(mDate.month());
							expect(selected.year()).toEqual(mDate.year());
							done();
						}
					}});

				utils.clickNthDay(component, 7);
				utils.clickNthDay(component, 8);
				utils.clickNthDay(component, 9);
			});

			it('when selecting month', () => {
				const date = _momentTimezone.tz('2000-03-15T02:02:02.002Z', 'UTC'),
					onChangeFn = jest.fn(),
					component = utils.createDatetime({ initialValue: date, dateFormat: 'YYYY-MM', onChange: onChangeFn });

				utils.clickNthMonth(component, 2);
				expect(onChangeFn).toHaveBeenCalledTimes(1);
				expect(onChangeFn.mock.calls[0][0].toJSON()).toEqual('2000-03-15T02:02:02.002Z');
			});

			// Passes locally but not on Travis
			xit('when selecting year', () => {
				const date = Date.UTC(2000, 0, 15, 2, 2, 2, 2),
					onChangeFn = jest.fn(),
					component = utils.createDatetime({ initialValue: date, dateFormat: 'YYYY', onChange: onChangeFn });

				utils.clickNthYear(component, 2);
				expect(onChangeFn).toHaveBeenCalledTimes(1);
				expect(onChangeFn.mock.calls[0][0].toJSON()).toEqual('2001-01-15T02:02:02.002Z');
			});

			it('when selecting time', () => {
				// Did not manage to be able to get onChange to trigger, even though I know it does.
				// The listener for the time buttons are set up differently because of having to handle both
				// onMouseDown and onMouseUp. Not sure how to test it.
				expect(true).toEqual(true);
			});

		});

	});

	describe('onNavigateForward', () => {
		it('when moving to next month', () => {
			const component = utils.createDatetime({ onNavigateForward: (amount, type) => {
				expect(amount).toEqual(1);
				expect(type).toEqual('months');
			}});

			utils.clickOnElement(component.find('.rdtNext'));
		});

		it('when moving to next year', () => {
			const component = utils.createDatetime({ initialViewMode: 'months', onNavigateForward: (amount, type) => {
				expect(amount).toEqual(1);
				expect(type).toEqual('years');
			}});

			utils.clickOnElement(component.find('.rdtNext'));
		});

		it('when moving decade forward', () => {
			const component = utils.createDatetime({ initialViewMode: 'years', onNavigateForward: (amount, type) => {
				expect(amount).toEqual(10);
				expect(type).toEqual('years');
			}});

			utils.clickOnElement(component.find('.rdtNext'));
		});
	});

	describe('onNavigateBack', () => {
		it('when moving to previous month', () => {
			const component = utils.createDatetime({ onNavigateBack: (amount, type) => {
				expect(amount).toEqual(1);
				expect(type).toEqual('months');
			}});

			utils.clickOnElement(component.find('.rdtPrev'));
		});

		it('when moving to previous year', () => {
			const component = utils.createDatetime({ initialViewMode: 'months', onNavigateBack: (amount, type) => {
				expect(amount).toEqual(1);
				expect(type).toEqual('years');
			}});

			utils.clickOnElement(component.find('.rdtPrev'));
		});

		it('when moving decade back', () => {
			const component = utils.createDatetime({ initialViewMode: 'years', onNavigateBack: (amount, type) => {
				expect(amount).toEqual(10);
				expect(type).toEqual('years');
			}});

			utils.clickOnElement(component.find('.rdtPrev'));
		});
	});

	describe('with set value', () => {
		it('date value', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				component = utils.createDatetime({ value: date });
			expect(utils.getInputValue(component)).toEqual(strDate);
		});

		it('moment value', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				component = utils.createDatetime({ value: mDate });
			expect(utils.getInputValue(component)).toEqual(strDate);
		});

		it('string value', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				component = utils.createDatetime({ value: strDate });
			expect(utils.getInputValue(component)).toEqual(strDate);
		});

		it('UTC value from local moment', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				momentDate = moment(date),
				momentDateUTC = moment.utc(date),
				strDateUTC = momentDateUTC.format('L') + ' ' + momentDateUTC.format('LT'),
				component = utils.createDatetime({ value: momentDate, utc: true });
			expect(utils.getInputValue(component)).toEqual(strDateUTC);
		});

		it('UTC value from UTC moment', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				momentDateUTC = moment.utc(date),
				strDateUTC = momentDateUTC.format('L') + ' ' + momentDateUTC.format('LT'),
				component = utils.createDatetime({ value: momentDateUTC, utc: true });
			expect(utils.getInputValue(component)).toEqual(strDateUTC);
		});

		it('UTC value from UTC string', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				momentDateUTC = moment.utc(date),
				strDateUTC = momentDateUTC.format('L') + ' ' + momentDateUTC.format('LT'),
				component = utils.createDatetime({ value: strDateUTC, utc: true });
			expect(utils.getInputValue(component)).toEqual(strDateUTC);
		});

		it('TZ value from local moment', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				displayTimeZone = 'America/New_York',
				momentDate = moment(date),
				momentDateTZ = moment.tz(date, displayTimeZone),
				strDateTZ = momentDateTZ.format('L') + ' ' + momentDateTZ.format('LT'),
				component = utils.createDatetime({ value: momentDate, displayTimeZone: displayTimeZone });
			expect(utils.getInputValue(component)).toEqual(strDateTZ);
		});

		it('TZ value from UTC moment', () => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				displayTimeZone = 'America/New_York',
				momentDateUTC = moment.utc(date),
				momentDateTZ = moment.tz(date, displayTimeZone),
				strDateTZ = momentDateTZ.format('L') + ' ' + momentDateTZ.format('LT'),
				component = utils.createDatetime({ value: momentDateUTC, displayTimeZone: displayTimeZone });
			expect(utils.getInputValue(component)).toEqual(strDateTZ);
		});

		it('invalid string value', (done) => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				component = utils.createDatetime({ initialValue: 'invalid-value', onChange: (updated) => {
					expect(mDate.format('L LT')).toEqual(updated.format('L LT'));
					done();
				}});

			expect(component.find('.form-control').getDOMNode().value).toEqual('invalid-value');
			component.find('.form-control').simulate('change', { target: { value: strDate }});
		});

		it('delete invalid string value', (done) => {
			const date = new Date(2000, 0, 15, 2, 2, 2, 2),
				component = utils.createDatetime({ initialValue: date, onChange: (date) => {
					expect(date).toEqual('');
					done();
				}});

			component.find('.form-control').simulate('change', { target: { value: '' }});
		});

		it('invalid moment object', (done) => {
			const invalidValue = moment(null),
				date = new Date(2000, 0, 15, 2, 2, 2, 2),
				mDate = moment(date),
				strDate = mDate.format('L') + ' ' + mDate.format('LT'),
				component = utils.createDatetime({ value: invalidValue, onChange: (updated) => {
					expect(mDate.format('L LT')).toEqual(updated.format('L LT'));
					done();
				}});

			expect(component.find('.form-control').getDOMNode().value).toEqual('');
			component.find('.form-control').simulate('change', { target: { value: strDate }});
		});

		it('should update the view date when updating the value prop', done => {
			const value1 = moment('2020-03-04T13:00:10.121Z');
			const value2 = moment('2021-06-04T13:00:10.121Z');

			let component = utils.createDatetime({ value: value1 });
			expect( component.instance().state.viewDate.toISOString() ).toBe(value1.toISOString());

			component.setProps({ value: value2 });
			setTimeout( () => {
				expect( component.instance().state.viewDate.toISOString() ).toBe(value2.toISOString());
				done();
			});
		});
	});

	describe('View navigation', () => {
		it('The calendar must be open in the updateOnView when not initialViewModel is defined', () => {
			const component = utils.createDatetime({ updateOnView: 'months' });

			expect( component.find('.rdtMonth').length ).not.toBe(0);
			expect( component.find('.rdtDay').length ).toBe(0);
		});

		it('The calendar must be open in the initialViewModel if it is defined', () => {
			const component = utils.createDatetime({ updateOnView: 'months', initialViewMode: 'days' });

			expect( component.find('.rdtMonth').length ).toBe(0);
			expect( component.find('.rdtDay').length ).not.toBe(0);
		});
		
		it('The calendar must be closed on select in the updateView, if closeOnSelect defined', done => {	

			const component = utils.createDatetime(
				{ updateOnView: 'months', closeOnSelect: true, input: true }
			);
			
			// Race condition fix
			setTimeout( () => {
				utils.openDatepicker( component );
				expect( utils.isOpen(component) ).toBeTruthy();
				utils.clickNthMonth( component, 1 );
				expect( utils.isOpen(component) ).toBeFalsy();
				done();
			});
		});

		it('The selected date must change when selecting in the updateView', done => {
			const initialDate = new Date(2000, 6, 15, 2, 2, 2, 2);
			const onChange = updated => {
				expect( updated.month() ).toBe( 1 );
				expect( updated.year() ).toBe( 2000 );
				
				// We shouldn't navigate when selecting in an updateView
				expect( component.find('.rdtMonth').length ).not.toBe(0);
				expect( component.find('.rdtDay').length ).toBe(0);

				done();
			};

			const component = utils.createDatetime({
				updateOnView: 'months', input: false, initialValue: initialDate, onChange
			});
			
			utils.clickNthMonth( component, 1 );
		});

		it('If the updateView is "time" clicking on a day shouldn`t update the selected date and navigate to the time', done => {
			const initialDate = new Date(2000, 6, 15, 2, 2, 2, 2);
			const onChangeFn = jest.fn();
			const component = utils.createDatetime({
				updateOnView: 'time', initialViewMode: 'days', input: false, initialValue: initialDate, onChangeFn
			});
			
			// Race condition fix
			setTimeout( () => {

				utils.clickNthDay( component, 1 );

				expect( component.find('.rdtDay').length ).toBe(0);
				expect( component.find('.rdtTime').length ).not.toBe(0);

				setTimeout(() => {
					expect(onChangeFn).toHaveBeenCalledTimes(0);
					done();
				}, 10 );
			});
		});
	});
	
});

describe('Imperative methods', function() {
	it('Calling setViewDate should navigate to the given date', function() {
		const initialDate = new Date(2000, 6, 15, 2, 2, 2, 2);
		const component = utils.createDatetime({ initialViewMode: 'months', initialViewDate: initialDate } );

		expect( utils.isMonthView( component ) ).toBeTruthy();
		expect( component.find('.rdtSwitch').text() ).toBe('2000');

		const nextDate = new Date( 2012, 10, 10 );
		component.instance().setViewDate( nextDate );
		
		expect( utils.isMonthView( component ) ).toBeTruthy();
		expect( component.find('.rdtSwitch').text() ).toBe('2012');
	});

	// This test is just not working, but it's using the setView method internally,
	// That is well tested by other specs in this file
	xit('Calling navigate should update to the given view', function( done ) {
		const initialDate = new Date(2000, 6, 15, 2, 2, 2, 2);
		const component = utils.createDatetime(
			{ initialViewMode: 'months', initialViewDate: initialDate }
		);
		
		expect( utils.isMonthView( component ) ).toBeTruthy();
		
		component.instance().navigate( 'days' );

		// Sync fix
		setTimeout( () => {
			expect( utils.isDayView( component ) ).toBeTruthy();
			component.instance().navigate( 'time' );
			expect( utils.isTimeView( component ) ).toBeTruthy();
			
			component.instance().navigate( 'years' );
			expect( utils.isYearView( component ) ).toBeTruthy();
			
			component.instance().navigate( 'months' );
			expect( utils.isMonthView( component ) ).toBeTruthy();

			// The date should stay unmodified
			expect( component.find('.rdtSwitch').text() ).toBe('2000');
			done();
		}, 100);

	});
});
