###* @jsx React.DOM ###

### global describe, beforeEach, afterEach, it, assert ###

React = require('react')
ReactTestUtils = require('react/lib/ReactTestUtils')
DateTimePickerHours = require('../cjs/DateTimePickerHours')

describe 'DateTimePickerHours', ->
  it 'Should have a timepicker-hours class', ->
    instance = ReactTestUtils.renderIntoDocument(DateTimePickerHours())
    assert.ok(instance.getDOMNode().className.match(/\btimepicker-hours\b/))