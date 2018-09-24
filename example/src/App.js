import React, { Component } from "react";
import "./react-datetime.css";

import LocalizationExample from "./LocalizationExample";
import CustomizableExample from "./CustomizableExample";
import OpenExample from "./OpenExample";
import ValidatedExample from "./ValidatedExample";

export default class App extends Component {
  render() {
    return (
      <div>
        <LocalizationExample />
        <CustomizableExample />
        <OpenExample />
        <ValidatedExample />
      </div>
    );
  }
}
