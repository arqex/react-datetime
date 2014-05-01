###* @jsx React.DOM ###

`import React from './react-es6'`

DateTimePickerMinutes = React.createClass(

  render: ->
    `(
      <div className="timepicker-minutes" data-action="selectMinute" style={{display: 'block'}}>
        <table className="table-condensed">
          <tbody>
            <tr>
              <td className="minute">00</td>

              <td className="minute">05</td>

              <td className="minute">10</td>

              <td className="minute">15</td>
            </tr>

            <tr>
              <td className="minute">20</td>

              <td className="minute">25</td>

              <td className="minute">30</td>

              <td className="minute">35</td>
            </tr>

            <tr>
              <td className="minute">40</td>

              <td className="minute">45</td>

              <td className="minute">50</td>

              <td className="minute">55</td>
            </tr>
          </tbody>
        </table>
      </div>
    )`

)

`export default = DateTimePickerMinutes`