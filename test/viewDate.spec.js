/* global it, describe, expect */

import React from 'react'; // eslint-disable-line no-unused-vars
import moment from 'moment';
import utils from './testUtils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

describe('with initialViewDate', () => {
	it('date value', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			strDate = moment(date).format('MMMM YYYY'),
			component = utils.createDatetime({initialViewDate: date});
		expect(utils.getViewDateValue(component)).toEqual(strDate);
	});

	it('moment value', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			mDate = moment(date),
			strDate = mDate.format('MMMM YYYY'),
			component = utils.createDatetime({initialViewDate: mDate});
		expect(utils.getViewDateValue(component)).toEqual(strDate);
	});

	it('string value', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			mDate = moment(date),
			strDate = mDate.format('L') + ' ' + mDate.format('LT'),
			expectedStrDate = mDate.format('MMMM YYYY'),
			component = utils.createDatetime({initialViewDate: strDate});
		expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
	});

	it('UTC value from UTC string', () => {
		const date = new Date(2000, 0, 15, 2, 2, 2, 2),
			momentDateUTC = moment.utc(date),
			strDateUTC = momentDateUTC.format('L') + ' ' + momentDateUTC.format('LT'),
			expectedStrDate = momentDateUTC.format('MMMM YYYY'),
			component = utils.createDatetime({initialViewDate: strDateUTC, utc: true});
		expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
	});

	it('invalid string value', () => {
		const strDate = 'invalid string',
			expectedStrDate = moment().format('MMMM YYYY'),
			component = utils.createDatetime({initialViewDate: strDate});
		expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
	});

	it('invalid moment object', () => {
		const mDate = moment(null),
			expectedStrDate = moment().format('MMMM YYYY'),
			component = utils.createDatetime({initialViewDate: mDate});
		expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
	});
});
