import React, { Component } from "react";

import DateTime from "react-datetime";
import "./react-datetime.css";
import nl from "date-fns/locale/nl";

import CustomizableExample from "./CustomizableExample";
import OpenExample from "./OpenExample";
import ValidatedExample from "./ValidatedExample";

export default class App extends Component {
  render() {
    return (
      <div>
        <DateTime
          viewMode="months"
          defaultValue={Date.UTC(2000, 0, 15, 2, 2, 2, 2)}
          locale={nl}
        />
        <CustomizableExample />
        <OpenExample />
        <ValidatedExample />
      </div>
    );
  }
}
