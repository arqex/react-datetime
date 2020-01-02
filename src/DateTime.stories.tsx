import * as React from "react";
import { withKnobs, optionsKnob as options } from "@storybook/addon-knobs";
import DateTime, { FORMATS } from "./.";
import "../scss/styles.scss";

import isBefore from "date-fns/isBefore";
import startOfDay from "date-fns/startOfDay";

import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";

const { useState } = React;

export default {
  title: "DateTime",
  decorators: [withKnobs]
};

function parseString(value) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}

export function SimpleExample() {
  function UncontrolledDateTime(props) {
    const [value, setValue] = useState<any>("");

    return (
      <div>
        <strong>Props:</strong> {JSON.stringify(props)}
        <div>
          <DateTime
            value={value}
            onChange={newVal => {
              console.log({ newVal });
              setValue(newVal);
            }}
            {...props}
          />
        </div>
        <br />
      </div>
    );
  }

  return (
    <div>
      <h2>Simple Scenarios</h2>

      <UncontrolledDateTime />

      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
      />
      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
        timeFormat={false}
      />
      <UncontrolledDateTime dateFormat={false} />

      <UncontrolledDateTime
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
      <UncontrolledDateTime
        dateFormat={false}
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
      <UncontrolledDateTime timeFormat={false} />

      <UncontrolledDateTime
        dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
        timeFormat={`${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}`}
      />
    </div>
  );
}

const localeOptions = {
  "EN - undefined": undefined,
  "NL - nl": nl,
  "ES - es": es,
  "FR - fr": fr
};
const localeNames = Object.keys(localeOptions).reduce(
  (prev, curr) => ({ ...prev, [curr]: curr }),
  {}
);

export function LocalizationExample() {
  const [value, setValue] = useState<any>(
    new Date(Date.UTC(2000, 0, 15, 2, 2, 2, 2))
  );
  const currentLocaleName = options("locale", localeNames, localeNames[0], {
    display: "inline-radio"
  });
  const currentLocale = currentLocaleName && localeOptions[currentLocaleName];

  return (
    <div className="form-horizontal">
      <h2>Locale props</h2>
      <p>
        Try out various locales (via <strong>knobs</strong>) and see how they
        affect the component.
      </p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        locale={currentLocale}
        dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
        timeFormat={false}
      />
    </div>
  );
}

const dateFormats = [
  `false`,
  `${FORMATS.YEAR}-${FORMATS.MONTH}-${FORMATS.DAY}`,
  `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
  `${FORMATS.DAY}.${FORMATS.MONTH}.${FORMATS.YEAR}`,
  `${FORMATS.MONTH}-${FORMATS.DAY}`,
  `${FORMATS.FULL_MONTH_NAME}`,
  `${FORMATS.YEAR}/${FORMATS.MONTH}`,
  `${FORMATS.YEAR}`
].reduce((prev, curr) => {
  return { ...prev, [curr]: curr };
}, {});

const timeFormats = [
  `false`,
  `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
  `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}`,
  `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND}`,
  `${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`,
  `${FORMATS.HOUR}${FORMATS.MINUTE}`,
  `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}xxx`
].reduce((prev, curr) => {
  return { ...prev, [curr]: curr };
}, {});

const dateTypeModes = [
  `default (Date)`,
  `utc-ms-timestamp`,
  `input-format`,
  `Date`
].reduce((prev, curr) => ({ ...prev, [curr]: curr }), {});

export function CustomizableExample() {
  const [value, setValue] = useState<any>(new Date(2019, 7, 2, 11, 25));

  const dateFormat = parseString(
    options(
      "dateFormat",
      dateFormats,
      `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
      {
        display: "inline-radio"
      }
    )
  );

  const timeFormat = parseString(
    options(
      "timeFormat",
      timeFormats,
      `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
      {
        display: "inline-radio"
      }
    )
  );

  const dateTypeMode = options("dateTypeMode", dateTypeModes, undefined, {
    display: "inline-radio"
  });

  return (
    <div className="form-horizontal">
      <h2>Customization props</h2>
      <p>
        Try out various configuration options (via <strong>knobs</strong>) and
        see how they affect the component.
      </p>

      <div>
        <strong>Value:</strong> {JSON.stringify(value)}
      </div>

      <form
        onSubmit={e => {
          alert("submitted");
          e.preventDefault();
        }}
      >
        <DateTime
          value={value}
          onChange={newValue => {
            console.log(newValue);
            setValue(newValue);
          }}
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          dateTypeMode={dateTypeMode}
        />
      </form>
    </div>
  );
}

const viewModeFormats: { [x: string]: any }[] = [
  ["Default - undefined", undefined, undefined],
  [`Years - ${FORMATS.YEAR}`, `${FORMATS.YEAR}`, undefined],
  [
    `Months - ${FORMATS.MONTH}/${FORMATS.YEAR}`,
    `${FORMATS.MONTH}/${FORMATS.YEAR}`,
    undefined
  ],

  [
    `Days - ${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
    `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
    undefined
  ],

  [
    `Time - ${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
    false,
    `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`
  ]
];
const viewModeOptions = viewModeFormats.reduce(
  (prev, curr) => ({ ...prev, [curr[0]]: curr[0] }),
  {}
);

export function ViewModeExample() {
  const [value, setValue] = useState(undefined);
  const viewModeOption = options(
    "View Mode",
    viewModeOptions,
    viewModeFormats[0][0],
    {
      display: "inline-radio"
    }
  );
  const viewModeFormat = viewModeFormats.find(
    viewModeName => viewModeName[0] === viewModeOption
  );
  const dateFormat = !viewModeFormat ? undefined : viewModeFormat[1];
  const timeFormat = !viewModeFormat ? undefined : viewModeFormat[2];

  return (
    <div>
      <h2>View Modes</h2>
      <p>
        Try out various formats (via <strong>knobs</strong>) and see how they
        affect the component.
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

export function ValidatedExample() {
  const [value, setValue] = useState(undefined);

  return (
    <div>
      <h2>isValidDate</h2>
      <p>You can use "isValidDate" to enable all dates before now.</p>

      <DateTime
        value={value}
        onChange={newValue => {
          console.log(newValue);
          setValue(newValue);
        }}
        timeFormat={false}
        isValidDate={current => isBefore(current, startOfDay(new Date()))}
      />
    </div>
  );
}
