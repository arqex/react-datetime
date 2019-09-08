import * as React from "react";
import DateTime from "../.";

const { useState } = React;

function SimpleExample() {
  const [value, setValue] = useState(new Date());

  return (
    <div>
      <h2>Simple Scenario</h2>
      <DateTime
        value={value}
        onChange={newVal => {
          console.log({ newVal });
          setValue(newVal);
        }}
      />
    </div>
  );
}

export default SimpleExample;
