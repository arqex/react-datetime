import * as React from "react";
import "../scss/styles.scss";

import SimpleExample from "./SimpleExample";
import LocalizationExample from "./LocalizationExample";
import CustomizableExample from "./CustomizableExample";
import OpenExample from "./OpenExample";
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
      <OpenExample />
      <hr />
      <ValidatedExample />
      <hr />
    </div>
  );
}
