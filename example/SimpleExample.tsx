import * as React from "react";
import DateTime from "../.";

const { useState } = React;

function UncontrolledDateTime(props) {
  const [value, setValue] = useState("");

  return (
    <div>
      <strong>Props:</strong> {JSON.stringify(props)}
      <DateTime
        value={value}
        onChange={newVal => {
          console.log({ newVal });
          setValue(newVal);
        }}
        {...props}
      />
      <br />
    </div>
  );
}

function SimpleExample() {
  return (
    <div>
      <h2>Simple Scenarios</h2>

      <UncontrolledDateTime />

      <UncontrolledDateTime dateFormat="LL/dd/yyyy" />
      <UncontrolledDateTime dateFormat="LL/dd/yyyy" timeFormat={false} />
      <UncontrolledDateTime dateFormat={false} />

      <UncontrolledDateTime timeFormat="HH:mm" />
      <UncontrolledDateTime dateFormat={false} timeFormat="HH:mm" />
      <UncontrolledDateTime timeFormat={false} />

      <UncontrolledDateTime dateFormat="LL/dd/yyyy" timeFormat="HH:mm" />
    </div>
  );
}

export default SimpleExample;
