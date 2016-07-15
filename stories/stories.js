var React = require('react');
var storybook = require('@kadira/storybook');
var Datetime = require('../DateTime.js');

storybook.storiesOf('DateTime', module)
  .add('default', function () {
    return <Datetime />
  })
  .add('with default value', function () {
    return <Datetime defaultValue={ new Date(1970, 0, 1) }/>
  })
  .add('without input', function () {
    return <Datetime input={ false }/>
  })
  .add('openned', function () {
    return <Datetime open={ true }/>
  })

storybook.storiesOf('DateTime.viewMode', module)
  .add('time', function () {
    return <Datetime viewMode='time'/>
  })
  .add('days', function () {
    return <Datetime viewMode='days'/>
  })
  .add('months', function () {
    return <Datetime viewMode='months'/>
  })
  .add('years', function () {
    return <Datetime viewMode='years'/>
  })

storybook.storiesOf('DateTime.isValidDate', module)
  .add('disabled before today', function () {
    var yesterday = Datetime.moment().subtract(1, 'day');
    var valid = function( current ){
        return current.isAfter( yesterday );
    };
    return <Datetime isValidDate={ valid } />
  })
  .add('disabled weekends', function () {
    var valid = function( current ){
        return current.day() != 0 && current.day() != 6;
    };
    return <Datetime isValidDate={ valid } />
  })
