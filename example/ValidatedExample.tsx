import * as React from "react";
import DateTime from "../.";
import isBefore from "date-fns/is_before";
import startOfMonth from "date-fns/start_of_month";

const { useState } = React;

function ValidatedExample() {
  const [value, setValue] = useState(undefined);

  return (
    <div>
      <h2>isValidDate</h2>
      <p>You can use "isValidDate" to disable all dates after last month.</p>

      <h3>Controlled</h3>
      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        viewMode="months"
        dateFormat="MMMM"
        timeFormat={false}
        isValidDate={current => isBefore(current, startOfMonth(new Date()))}
      />

      <h3>Uncontrolled</h3>
      <DateTime
        defaultValue={value}
        viewMode="months"
        dateFormat="MMMM"
        timeFormat={false}
        isValidDate={current => isBefore(current, startOfMonth(new Date()))}
      />
    </div>
  );
}

export default ValidatedExample;
