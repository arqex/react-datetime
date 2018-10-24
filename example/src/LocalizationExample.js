import React, { Component } from "react";
import DateTime from "@nateradebaugh/react-datetime";
import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";

class LocalizationExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocale: undefined
    };

    // Bind functions
    this.renderButton = this.renderButton.bind(this);
  }

  renderButton(text, newLocale) {
    return (
      <button
        type="button"
        onClick={() => this.setState({ currentLocale: newLocale })}
        disabled={this.state.currentLocale === newLocale}
      >
        {text}
      </button>
    );
  }

  render() {
    return (
      <div className="form-horizontal">
        <h2>Locale props</h2>
        <p>Try out various locales and see how they affect the component.</p>
        <p>
          {this.renderButton("EN - undefined", undefined)}
          {this.renderButton("NL - nl", nl)}
          {this.renderButton("ES - es", es)}
          {this.renderButton("FR - fr", fr)}
        </p>

        <DateTime
          viewMode="months"
          defaultValue={Date.UTC(2000, 0, 15, 2, 2, 2, 2)}
          locale={this.state.currentLocale}
          open={true}
          input={false}
        />
      </div>
    );
  }
}

export default LocalizationExample;
