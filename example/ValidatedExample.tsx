import * as React from "react";
import DateTime from "../.";
import isBefore from "date-fns/isBefore";

const { useState } = React;

function ValidatedExample() {
  const [value, setValue] = useState(undefined);

  return (
    <div>
      <h2>isValidDate</h2>
      <p>You can use "isValidDate" to enable all dates before now.</p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        timeFormat={false}
        isValidDate={current => isBefore(current, new Date())}
      />
    </div>
  );
}

export default ValidatedExample;
