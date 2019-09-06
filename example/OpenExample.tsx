import * as React from "react";
import DateTime from "../.";

const { useState } = React;

function OpenExample() {
  const [value, setValue] = useState(undefined);
  const [viewMode, setViewMode] = useState(undefined);

  function renderButton(text: string, newViewMode) {
    return (
      <button
        type="button"
        onClick={() => setViewMode(newViewMode)}
        disabled={viewMode === newViewMode}
      >
        {text}
      </button>
    );
  }

  return (
    <div>
      <h2>open</h2>
      <p>
        The "open" prop is only consumed when the component is mounted. Useful
        for embedding inside your own popover components.
      </p>
      <p>Try out various viewModes and see how they affect the component.</p>
      <p>
        {renderButton("Default - undefined", undefined)}
        {renderButton("Years", "years")}
        {renderButton("Months", "months")}
        {renderButton("Days", "days")}
        {renderButton("Time", "time")}
      </p>

      <h3>Controlled</h3>
      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        open={true}
        input={false}
        viewMode={viewMode}
      />

      <h3>Uncontrolled</h3>
      <DateTime
        defaultValue={value}
        open={true}
        input={false}
        viewMode={viewMode}
      />
    </div>
  );
}

export default OpenExample;
