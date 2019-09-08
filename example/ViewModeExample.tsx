import * as React from "react";
import DateTime from "../.";

const { useState } = React;

function ViewModeExample() {
  const [value, setValue] = useState(undefined);
  const [dateFormat, setDateFormat] = useState<string | boolean | undefined>(
    undefined
  );
  const [timeFormat, setTimeFormat] = useState<string | boolean | undefined>(
    undefined
  );

  function renderButton(
    text: string,
    newDateFormat: string | boolean | undefined,
    newTimeFormat: string | boolean | undefined
  ) {
    return (
      <button
        type="button"
        onClick={() => {
          setDateFormat(newDateFormat);
          setTimeFormat(newTimeFormat);
        }}
        disabled={dateFormat === newDateFormat && timeFormat === newTimeFormat}
      >
        {text}
      </button>
    );
  }

  return (
    <div>
      <h2>View Modes</h2>
      <p>Try out various formats and see how they affect the component.</p>
      <p>
        {renderButton("Default - undefined", undefined, undefined)}
        {renderButton("Years - yyyy", "yyyy", undefined)}
        {renderButton("Months - LL/yyyy", "LL/yyyy", undefined)}
        {renderButton("Days - LL/dd/yyyy", "LL/dd/yyyy", undefined)}
        {renderButton("Time - h:mm a", false, "h:mm a")}
      </p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
      />
    </div>
  );
}

export default ViewModeExample;
