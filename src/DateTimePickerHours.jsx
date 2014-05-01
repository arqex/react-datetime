
/** @jsx React.DOM */
import React from './react-es6';
var DateTimePickerHours;

DateTimePickerHours = React.createClass({
  render: function() {
    return (
      <div className="timepicker-hours" data-action="selectHour" style={{display: 'block'}}>
        <table className="table-condensed">
          <tbody>
            <tr>
              <td className="hour">01</td>

              <td className="hour">02</td>

              <td className="hour">03</td>

              <td className="hour">04</td>
            </tr>

            <tr>
              <td className="hour">05</td>

              <td className="hour">06</td>

              <td className="hour">07</td>

              <td className="hour">08</td>
            </tr>

            <tr>
              <td className="hour">09</td>

              <td className="hour">10</td>

              <td className="hour">11</td>

              <td className="hour">12</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

export default = DateTimePickerHours;
