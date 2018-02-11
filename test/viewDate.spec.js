/* global it, describe, expect */

import React from 'react'; // eslint-disable-line no-unused-vars
import moment from 'moment';
import utils from './testUtils';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

Enzyme.configure({adapter: new Adapter()});

describe('with viewDate', () => {
    it('date value', () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2),
            strDate = moment(date).format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: date});
        expect(utils.getViewDateValue(component)).toEqual(strDate);
    });

    it('moment value', () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2),
            mDate = moment(date),
            strDate = mDate.format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: mDate});
        expect(utils.getViewDateValue(component)).toEqual(strDate);
    });

    it('string value', () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2),
            mDate = moment(date),
            strDate = mDate.format('L') + ' ' + mDate.format('LT'),
            expectedStrDate = mDate.format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: strDate});
        expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
    });

    it('UTC value from UTC string', () => {
        const date = new Date(2000, 0, 15, 2, 2, 2, 2),
            momentDateUTC = moment.utc(date),
            strDateUTC = momentDateUTC.format('L') + ' ' + momentDateUTC.format('LT'),
            expectedStrDate = momentDateUTC.format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: strDateUTC, utc: true});
        expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
    });

    it('invalid string value', () => {
        const strDate = 'invalid string',
            expectedStrDate = moment().format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: strDate});
        expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
    });

    it('invalid moment object', () => {
        const mDate = moment(null),
            expectedStrDate = moment().format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: mDate});
        expect(utils.getViewDateValue(component)).toEqual(expectedStrDate);
    });

    it('viewDate -> picker should change the initial month (viewMode=months)', () => {
        const preDate = new Date(2000, 0, 15, 2, 2, 2, 2),
            strPreDate = moment(preDate).format('MMMM YYYY'),
            component = utils.createDatetime({viewDate: preDate});
        expect(utils.getViewDateValue(component)).toEqual(strPreDate);

        const postDate = new Date(2010, 0, 15, 2, 2, 2, 2),
            strPostDate = moment(postDate).format('MMMM YYYY');
        component.setProps({viewDate: postDate});
        expect(utils.getViewDateValue(component)).toEqual(strPostDate);
    });
});
