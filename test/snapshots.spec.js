/* global it, describe, expect, jest */

import React from 'react' // eslint-disable-line no-unused-vars
import Datetime from '../src/DateTime.js'
import renderer from 'react-test-renderer'

// findDOMNode is not supported by the react-test-renderer,
// and even though this component is not using that method
// a dependency is probably using it. So we need to mock it
// to make the tests pass.
// https://github.com/facebook/react/issues/7371
jest.mock('react-dom', () => ({
    findDOMNode: () => {},
}))

// Mock date to get rid of time as a factor to make tests deterministic
Date.now = jest.fn(() => 1482363367071)

it('everything default: renders correctly', () => {
    const tree = renderer.create(
        <Datetime />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

it('value: set to arbitrary value', () => {
    const tree = renderer.create(
        <Datetime value={Date.now()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

it('defaultValue: set to arbitrary value', () => {
    const tree = renderer.create(
        <Datetime defaultValue={Date.now()} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

describe('dateFormat', () => {
    it('set to true', () => {
        const tree = renderer.create(
            <Datetime dateFormat={true} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('set to false', () => {
        const tree = renderer.create(
            <Datetime dateFormat={false} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

describe('timeFormat', () => {
    it('set to true', () => {
        const tree = renderer.create(
            <Datetime timeFormat={true} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('set to false', () => {
        const tree = renderer.create(
            <Datetime timeFormat={false} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

describe('input', () => {
    it('input: set to true', () => {
        const tree = renderer.create(
            <Datetime input={true} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('input: set to false', () => {
        const tree = renderer.create(
            <Datetime input={false} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

describe('open', () => {
    it('set to true', () => {
        const tree = renderer.create(
            <Datetime open={true} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('set to false', () => {
        const tree = renderer.create(
            <Datetime open={false} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

describe('viewMode', () => {
    it('set to days', () => {
        const tree = renderer.create(
            <Datetime viewMode={'days'} open />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('set to months', () => {
        const tree = renderer.create(
            <Datetime viewMode={'months'} open />
        ).toJSON()
        expect(tree).toMatchSnapshot()
    })

    it('set to years', () => {
        const tree = renderer.create(
            <Datetime viewMode={'years'} open />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('set to time', () => {
        const tree = renderer.create(
            <Datetime viewMode={'time'} open />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

it('className: set to arbitraty value', () => {
    const tree = renderer.create(
        <Datetime className={'arbitrary-value'} />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

describe('inputProps', () => {
    it('with placeholder specified', () => {
        const tree = renderer.create(
            <Datetime inputProps={{ placeholder: 'arbitrary-placeholder' }} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('with disabled specified', () => {
        const tree = renderer.create(
            <Datetime inputProps={{ disabled: true }} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('with required specified', () => {
        const tree = renderer.create(
            <Datetime inputProps={{ required: true }} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('with name specified', () => {
        const tree = renderer.create(
            <Datetime inputProps={{ name: 'arbitrary-name' }} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })

    it('with className specified', () => {
        const tree = renderer.create(
            <Datetime inputProps={{ className: 'arbitrary-className' }} />
        ).toJSON()

        expect(tree).toMatchSnapshot()
    })
})

it('isValidDate: only valid if after yesterday', () => {
    // TODO
    const yesterday = Datetime.moment().subtract(1, 'day')
    const valid = (current) => current.isAfter(yesterday)
    const tree = renderer.create(
        <Datetime isValidDate={ valid } open />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

it('renderDay: specified', () => {
    const renderDay = ({ date, className, onClick }) =>
      <td className={className} onClick={onClick}>{ `_${date.date()}_` }</td>

    const tree = renderer.create(
        <Datetime renderDay={renderDay} open />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

it('renderMonth: specified', () => {
    const renderMonth = ({ month, year, className, onClick }) =>
      <td className={className} onClick={onClick}>{ `_${month}_${year}_` }</td>

    const tree = renderer.create(
        <Datetime renderMonth={renderMonth} open />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})

it('renderYear: specified', () => {
    const renderYear = ({ year, className, onClick }) =>
      <td className={className} onClick={onClick}>{ `_${year}_` }</td>

    const tree = renderer.create(
        <Datetime renderYear={renderYear} open />
    ).toJSON()

    expect(tree).toMatchSnapshot()
})
