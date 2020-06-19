import * as React from "react";
import {
  withKnobs,
  optionsKnob as options,
  boolean,
} from "@storybook/addon-knobs";
import DateTime, { FORMATS } from "./.";
import "../scss/styles.scss";

import isBefore from "date-fns/isBefore";
import startOfDay from "date-fns/startOfDay";
import isMonday from "date-fns/isMonday";
import isWeekend from "date-fns/isWeekend";
import isSameMonth from "date-fns/isSameMonth";
import isSameYear from "date-fns/isSameYear";

import nl from "date-fns/locale/nl";
import es from "date-fns/locale/es";
import fr from "date-fns/locale/fr";

const { useState } = React;

export default {
  title: "DateTime",
  decorators: [withKnobs],
};

function parseString(value) {
  if (value === "undefined") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return value;
}

export function SimpleExamples(): JSX.Element {
  function UncontrolledDateTime(props) {
    const [value, setValue] = useState<any>(props.value);

    return (
      <div>
        <strong>Props:</strong> {JSON.stringify(props)}
        <div>
          <React.StrictMode>
            <DateTime
              {...props}
              value={value}
              onChange={(newVal) => {
                console.log({ newVal });
                setValue(newVal);
              }}
              onBlur={(newVal) => {
                alert(newVal);
              }}
            />
          </React.StrictMode>
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

export function InlineExamples(): JSX.Element {
  function UncontrolledDateTime({ label, ...props }) {
    const [value, setValue] = useState<any>(props.value);

    return (
      <div className="col-sm-auto mb-3">
        <div>
          <strong>{label}</strong> - {props.dateFormat} {props.timeFormat}
        </div>
        <React.StrictMode>
          <DateTime
            {...props}
            value={value}
            onChange={(newVal) => {
              console.log({ newVal });
              setValue(newVal);
            }}
          />
        </React.StrictMode>
      </div>
    );
  }

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
        integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
        crossOrigin="anonymous"
      />

      <div className="container-fluid">
        <h2>Inline Examples</h2>

        <div className="row">
          <UncontrolledDateTime
            label="Date/Time"
            shouldHideInput
            dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
            timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Date"
            shouldHideInput
            dateFormat={`${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`}
            timeFormat={false}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Month"
            shouldHideInput
            dateFormat={`${FORMATS.MONTH}/${FORMATS.YEAR}`}
            timeFormat={false}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Year"
            shouldHideInput
            dateFormat={`${FORMATS.YEAR}`}
            timeFormat={false}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />

          <UncontrolledDateTime
            label="Time"
            shouldHideInput
            dateFormat={false}
            timeFormat={`${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`}
            value={new Date(2019, 7, 2, 11, 25, 24, 123)}
          />
        </div>
      </div>
    </div>
  );
}

export function CustomizableExample(): JSX.Element {
  const [value, setValue] = useState<any>(new Date(2019, 7, 2, 11, 25));

  //
  // shouldHideInput
  //
  const shouldHideInput = boolean("shouldHideInput", true);

  //
  // locale
  //
  const localeOptions = {
    "EN - undefined": undefined,
    "NL - nl": nl,
    "ES - es": es,
    "FR - fr": fr,
  };

  const currentLocaleName = options(
    "locale",
    Object.keys(localeOptions).reduce(
      (prev, curr) => ({ ...prev, [curr]: curr }),
      {}
    ),
    "EN - undefined",
    {
      display: "inline-radio",
    }
  );
  const currentLocale = currentLocaleName && localeOptions[currentLocaleName];

  //
  // dateFormat
  //
  const dateFormat = parseString(
    options(
      "dateFormat",
      [
        `undefined`,
        `false`,
        `${FORMATS.YEAR}-${FORMATS.MONTH}-${FORMATS.DAY}`,
        `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
        `${FORMATS.DAY}.${FORMATS.MONTH}.${FORMATS.YEAR}`,
        `${FORMATS.MONTH}-${FORMATS.DAY}`,
        `${FORMATS.FULL_MONTH_NAME}`,
        `${FORMATS.YEAR}/${FORMATS.MONTH}`,
        `${FORMATS.YEAR}`,
      ].reduce((prev, curr) => {
        return { ...prev, [curr]: curr };
      }, {}),
      `${FORMATS.MONTH}/${FORMATS.DAY}/${FORMATS.YEAR}`,
      {
        display: "inline-radio",
      }
    )
  );

  //
  // timeFormat
  //
  const timeFormat = parseString(
    options(
      "timeFormat",
      [
        `undefined`,
        `false`,
        `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
        `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}`,
        `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND}`,
        `${FORMATS.HOUR}:${FORMATS.MINUTE}:${FORMATS.SECOND}.${FORMATS.MILLISECOND} ${FORMATS.AM_PM}`,
        `${FORMATS.HOUR}${FORMATS.MINUTE}`,
        `${FORMATS.MILITARY_HOUR}:${FORMATS.MINUTE}xxx`,
      ].reduce((prev, curr) => {
        return { ...prev, [curr]: curr };
      }, {}),
      `${FORMATS.HOUR}:${FORMATS.MINUTE} ${FORMATS.AM_PM}`,
      {
        display: "inline-radio",
      }
    )
  );

  //
  // dateTypeMode
  //
  const dateTypeMode = parseString(
    options(
      "dateTypeMode",
      [`undefined`, `utc-ms-timestamp`, `input-format`, `Date`].reduce(
        (prev, curr) => ({ ...prev, [curr]: curr }),
        {}
      ),
      "undefined",
      {
        display: "inline-radio",
      }
    )
  );

  //
  // isValidDate
  //
  const isValidDateOptions = {
    "default - undefined": undefined,
    "All Valid": () => true,
    "All Invalid": () => false,
    "Only Mondays": (date: Date) => isMonday(date),
    "Only Weekdays": (date: Date) => !isWeekend(date),
    "Only Weekends": (date: Date) => isWeekend(date),
    "Days Before The 18th": (date: Date) =>
      isBefore(date, startOfDay(new Date(2019, 7, 18, 11, 25))),
    "Just March": (date: Date) => isSameMonth(date, new Date(2019, 2, 16)),
    "Just 2012": (date: Date) => isSameYear(date, new Date(2012, 2, 16)),
  };

  const isValidDateName = options(
    "isValidDate",
    Object.keys(isValidDateOptions).reduce(
      (prev, curr) => ({ ...prev, [curr]: curr }),
      {}
    ),
    "default - undefined",
    {
      display: "inline-radio",
    }
  );
  const isValidDate = isValidDateName && isValidDateOptions[isValidDateName];

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
        onSubmit={(e) => {
          alert("submitted");
          e.preventDefault();
        }}
      >
        <React.StrictMode>
          <DateTime
            shouldHideInput={shouldHideInput}
            value={value}
            onChange={(newValue) => {
              console.log(newValue);
              setValue(newValue);
            }}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
            dateTypeMode={dateTypeMode}
            locale={currentLocale}
            isValidDate={isValidDate}
          />
        </React.StrictMode>
      </form>
    </div>
  );
}
