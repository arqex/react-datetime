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
  }

  render() {
    return (
      <div className="form-horizontal">
        <h2>Locale props</h2>
        <p>Try out various locales and see how they affect the component.</p>
        <p>
          <button
            type="button"
            onClick={() => this.setState({ currentLocale: undefined })}
            disabled={this.state.currentLocale === undefined}
          >
            EN - undefined
          </button>
          <button
            type="button"
            onClick={() => this.setState({ currentLocale: nl })}
            disabled={this.state.currentLocale === nl}
          >
            NL - nl
          </button>
          <button
            type="button"
            onClick={() => this.setState({ currentLocale: es })}
            disabled={this.state.currentLocale === es}
          >
            ES - es
          </button>
          <button
            type="button"
            onClick={() => this.setState({ currentLocale: fr })}
            disabled={this.state.currentLocale === fr}
          >
            FR - fr
          </button>
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
