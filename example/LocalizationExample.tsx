import * as React from "react";
import DateTime from "../.";
import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";

const { useState } = React;

function LocalizationExample() {
  const [value, setValue] = useState(
    new Date(Date.UTC(2000, 0, 15, 2, 2, 2, 2))
  );
  const [currentLocale, setCurrentLocale] = useState();

  function renderButton(text: string, newLocale: any) {
    return (
      <button
        type="button"
        onClick={() => setCurrentLocale(newLocale)}
        disabled={currentLocale === newLocale}
      >
        {text}
      </button>
    );
  }

  return (
    <div className="form-horizontal">
      <h2>Locale props</h2>
      <p>Try out various locales and see how they affect the component.</p>
      <p>
        {renderButton("EN - undefined", undefined)}
        {renderButton("NL - nl", nl)}
        {renderButton("ES - es", es)}
        {renderButton("FR - fr", fr)}
      </p>

      <DateTime
        viewMode="months"
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        locale={currentLocale}
        open={true}
        input={false}
      />
    </div>
  );
}

export default LocalizationExample;
