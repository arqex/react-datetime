import * as React from "react";
import "../scss/styles.scss";

import SimpleExample from "./SimpleExample";
import LocalizationExample from "./LocalizationExample";
import CustomizableExample from "./CustomizableExample";
import ViewModeExample from "./ViewModeExample";
import ValidatedExample from "./ValidatedExample";

export default function App() {
  return (
    <div>
      <SimpleExample />
      <hr />
      <LocalizationExample />
      <hr />
      <CustomizableExample />
      <hr />
      <ViewModeExample />
      <hr />
      <ValidatedExample />
      <hr />
    </div>
  );
}
